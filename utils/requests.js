const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch sigle list

async function fetchLists(id) {
  try {
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/lists/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Fetch single tag

async function fetchTags(id) {
  try {
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/tags/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchTasks(id) {
  try {
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/tasks/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchLists, fetchTags, fetchTasks };

// Fetch single tag
