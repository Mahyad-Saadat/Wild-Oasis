import supabase, { supabaseUrl } from "./supabase";

interface Cabin {
  id?: number;
  image?: File | string;
  name: string;
  // Add other fields as required
}

export async function getCabins(): Promise<Cabin[]> {
  const { data, error } = await supabase.from("Cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data as Cabin[]; // Ensure data is cast as Cabin[]
}

export async function createEditCabin(
  newCabin: Cabin,
  id?: number
): Promise<Cabin> {
  const hasImagePath =
    typeof newCabin.image === "string" &&
    newCabin.image.startsWith(supabaseUrl);

  const imageName = `${Math.random()}-${(newCabin.image as File).name}`.replace(
    /\//g,
    ""
  ); // Use regex for replace
  const imagePath = hasImagePath
    ? (newCabin.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // Create a new query instance
  const query = supabase.from("cabins"); // Use the generic type here

  // A) CREATE
  if (!id) {
    const { data, error } = await query
      .insert([{ ...newCabin, image: imagePath }])
      .single(); // Use single to get the inserted data directly
    if (error) {
      console.error(error);
      throw new Error("Cabin could not be created");
    }
    return data as Cabin; // Return the created cabin
  }

  // B) EDIT
  const { data, error } = await query
    .update({ ...newCabin, image: imagePath })
    .eq("id", id)
    .single(); // Use single to get the updated data directly
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be edited");
  }

  // 2. Upload image
  if (hasImagePath) return data as Cabin;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image as File);

  // 3. Delete the cabin IF there was an error uploading the image
  if (storageError) {
    // Use a type assertion to ensure TypeScript recognizes data is of type Cabin
    if (data) {
      const cabinId = (data as Cabin).id; // Cast data to Cabin
      await supabase.from("cabins").delete().eq("id", cabinId); // Access data.id safely
    }
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data as Cabin; // Return the updated cabin
}

export async function deleteCabin(id: number): Promise<Cabin[]> {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data ?? []; // Cast data as Cabin[] even if data could be null
}
