// List of note files (update paths as needed)
const noteFiles = [
  "00_notes/wildcard_mask.md",
  "00_notes/adding_ssh_keys_to_github.md",
  "00_notes/bash_date_loop.md",
  "00_notes/bird.md",
  "00_notes/cisco_nxos.md",
  "00_notes/encode_decode_with_base64.md",
  "00_notes/firewalld.md",
  "00_notes/git.md",
  "00_notes/mtr.md",
  "00_notes/network_info_powershell.md",
  "00_notes/setting_timezone_in_linux.md",
  "00_notes/tshark_cdp_and_lldp.md"
];

// Fetch and parse all notes
async function loadNotes() {
  const resultsContainer = document.getElementById("results");
  const searchInput = document.getElementById("searchInput");

  // Load all note content
  const notes = await Promise.all(
    noteFiles.map(async (file) => {
      const response = await fetch(file);
      const text = await response.text();
      return { file, content: text };
    })
  );

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    resultsContainer.innerHTML = "";

    notes.forEach(({ file, content }) => {
      const title = file.split("/").pop().replace(".md", "");
      const matches = content.toLowerCase().includes(query);

      if (matches) {
        const div = document.createElement("div");
        div.innerHTML = `<h2><a href="${file}">${title}</a></h2><p>${content.substring(0, 150)}...</p>`;
        resultsContainer.appendChild(div);
      }
    });
  });
}

loadNotes();
