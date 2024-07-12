const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch sigle list

async function fetchList(id) {
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

// Fetch all lists

async function fetchLists() {
  try {
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/lists`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single tag

async function fetchTag(id) {
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

// Fetch all tags

async function fetchTags() {
  try {
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/tags`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single task

async function fetchTask(id) {
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

// Fetch all tasks

async function fetchTasks() {
  try {
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(`${apiDomain}/tasks`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    console.log(res.status);

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export { fetchList, fetchLists, fetchTag, fetchTags, fetchTask, fetchTasks };

// Fetch single tag
