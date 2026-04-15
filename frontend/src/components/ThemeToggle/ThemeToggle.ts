export function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = themeToggle?.querySelector('.light-icon');
    const darkIcon = themeToggle?.querySelector('.dark-icon');

    const updateIcons = (isDark: boolean) => {
        if (isDark) {
            lightIcon?.classList.remove('hidden');
            darkIcon?.classList.add('hidden');
        } else {
            lightIcon?.classList.add('hidden');
            darkIcon?.classList.remove('hidden');
        }
    };

    // Initial state
    const isDark = document.documentElement.classList.contains('dark');
    updateIcons(isDark);

    themeToggle?.addEventListener('click', () => {
        const isDarkNow = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
        updateIcons(isDarkNow);
    });
}

// Initialize on page load
initThemeToggle();

// Re-initialize after view transitions (if using them)
document.addEventListener('astro:after-swap', initThemeToggle);
