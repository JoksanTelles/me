export function initNewsletter() {
    const form = document.getElementById('newsletter-form') as HTMLFormElement;
    const emailInput = document.getElementById('newsletter-email') as HTMLInputElement;
    const submitBtn = document.getElementById('newsletter-submit') as HTMLButtonElement;
    const successMsg = document.getElementById('newsletter-success-msg');
    const errorMsg = document.getElementById('newsletter-error-msg');

    if (!form) return;

    const idleSpan = submitBtn?.querySelector('.idle');
    const loadingSpan = submitBtn?.querySelector('.loading');
    const successSpan = submitBtn?.querySelector('.success');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!emailInput || !submitBtn) return;

        // Loading state
        idleSpan?.classList.add('hidden');
        loadingSpan?.classList.remove('hidden');
        submitBtn.disabled = true;
        errorMsg?.classList.add('hidden');

        try {
            // Simulation of subscription
            await new Promise(resolve => setTimeout(resolve, 1500));

            loadingSpan?.classList.add('hidden');
            successSpan?.classList.remove('hidden');
            successMsg?.classList.remove('hidden');
            form.reset();
        } catch (err) {
            loadingSpan?.classList.add('hidden');
            idleSpan?.classList.remove('hidden');
            errorMsg?.classList.remove('hidden');
            submitBtn.disabled = false;
        }
    });
}

// Initialize
initNewsletter();

// Support Astro View Transitions
document.addEventListener('astro:after-swap', initNewsletter);
