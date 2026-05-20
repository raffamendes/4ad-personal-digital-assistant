// Using window.location.hostname makes the app work on any device in the network
const getBaseUrl = () => {
  const host = window.location.hostname;
  return `http://${host}:8080/characters`;
};

export async function getAllCharacters() {
  try {
    const response = await fetch(getBaseUrl());
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCharacter(id) {
  try {
    const response = await fetch(`${getBaseUrl()}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCharacter(character) {
  try {
    const response = await fetch(getBaseUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCharacter(id, character) {
  try {
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    if (!response.ok) throw new Error('Failed to update');
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteCharacter(id) {
  try {
    const response = await fetch(`${getBaseUrl()}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
