document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* GitHub API Integration */
const GITHUB_API_BASE = "https://api.github.com/repos/DHRUVILPATEL2303";

const projectsConfig = {
  "Uber-Project": {
    repo: "Uber-Project",
    selector: "a[href*='Uber-Project']"
  },
  "Smart Waste Suite": {
    repos: ["SmartWaste-Admin", "SmartWaste-User", "SmartWaste-Waste-Collector", "Smart_Waste_Notification_Backend_Spring_boot"],
    selector: "a[href*='SmartWaste']"
  },
  "DPKV-Color-Trading": {
    repo: "DPKV-Color-Trading",
    selector: "a[href*='DPKV-Color-Trading']"
  },
  "DPKV-Prediction-Market": {
    repo: "DPKV-Prediction-Market",
    selector: "a[href*='DPKV-Prediction-Market']"
  },
  "QuoraApp_Backend_Spring_boot": {
    repo: "QuoraApp_Backend_Spring_boot",
    selector: "a[href*='QuoraApp']"
  }
};

async function fetchRepoStats(owner, repo) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${repo}`);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    
    const data = await response.json();
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      watchers: data.watchers_count || 0,
      language: data.language || "Unknown",
      description: data.description || "",
      updated: new Date(data.updated_at).toLocaleDateString()
    };
  } catch (error) {
    console.warn(`Failed to fetch stats for ${repo}:`, error);
    return null;
  }
}

async function enhanceProjectCard(projectName, config) {
  try {
    let stats = null;
    
    if (config.repo) {
      stats = await fetchRepoStats("DHRUVILPATEL2303", config.repo);
    } else if (config.repos && config.repos.length > 0) {
      // For projects with multiple repos, fetch from the first one
      stats = await fetchRepoStats("DHRUVILPATEL2303", config.repos[0]);
    }
    
    if (stats) {
      // Find the project article
      const articles = document.querySelectorAll(".project");
      for (const article of articles) {
        const text = article.textContent;
        if (text.includes(projectName)) {
          // Check if stats already added
          if (!article.querySelector(".project-stats")) {
            const statsHtml = `
              <div class="project-stats" style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid var(--line); display: flex; gap: 1rem; font-size: 0.85rem; color: var(--muted);">
                <span>⭐ ${stats.stars} stars</span>
                <span>🔀 ${stats.forks} forks</span>
                <span>${stats.language}</span>
              </div>
            `;
            const linksSection = article.querySelector(".project-links");
            if (linksSection) {
              linksSection.insertAdjacentHTML("afterend", statsHtml);
            }
          }
          break;
        }
      }
    }
  } catch (error) {
    console.warn(`Error enhancing ${projectName}:`, error);
  }
}

// Enhance all project cards with GitHub stats
async function enhanceAllProjects() {
  // Add a small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  for (const [projectName, config] of Object.entries(projectsConfig)) {
    await enhanceProjectCard(projectName, config);
  }
}

// Run on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceAllProjects);
} else {
  enhanceAllProjects();
}
