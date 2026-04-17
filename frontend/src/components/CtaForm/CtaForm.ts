export function initCtaForm() {
    const root = document.getElementById("cta-form-root");
    const steps = root?.querySelectorAll(".step-container");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");
    const nextBtns = root?.querySelectorAll(".next-btn");
    const prevBtns = root?.querySelectorAll(".prev-btn");
    const submitBtn = document.getElementById("submit-cta") as HTMLButtonElement;
    const areaOptions = root?.querySelectorAll("#area-options .cta-option-card");

    if (!root) return;

    let currentStep = 1;
    const totalSteps = 3;
    const formData = {
        name: "",
        email: "",
        company: "",
        role: "",
        description: "",
        area: "",
        problem: "",
        deadline: "",
        budget: "",
    };

    const updateView = () => {
        steps?.forEach((step, idx) => {
            if (idx + 1 === currentStep) {
                step.classList.remove("hidden");
            } else {
                step.classList.add("hidden");
            }
        });

        if (currentStep > totalSteps) {
            progressContainer?.classList.add("hidden");
        } else {
            if (progressBar) {
                progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
            }
        }
    };

    nextBtns?.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateView();
            }
        });
    });

    prevBtns?.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                updateView();
            }
        });
    });

    areaOptions?.forEach((opt) => {
        opt.addEventListener("click", () => {
            areaOptions.forEach((o) => o.classList.remove("cta-option-card-active"));
            opt.classList.add("cta-option-card-active");
            formData.area = (opt as HTMLElement).dataset.value || "";
        });
    });

    submitBtn?.addEventListener("click", async () => {
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoading = submitBtn.querySelector(".btn-loading");

        // Sync all inputs to formData
        const inputs = root?.querySelectorAll("input, textarea, select");
        inputs?.forEach((input) => {
            const name = (input as HTMLInputElement).name;
            if (name) {
                (formData as any)[name] = (input as HTMLInputElement).value;
            }
        });

        btnText?.classList.add("hidden");
        btnLoading?.classList.remove("hidden");
        submitBtn.disabled = true;

        try {
            const apiUrl = (import.meta as any).env.PUBLIC_API_URL || "http://localhost:8080";
            const response = await fetch(`${apiUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                currentStep = 4;
                updateView();
            } else {
                throw new Error("Failed to submit");
            }
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error. Por favor intenta de nuevo.");
            btnText?.classList.remove("hidden");
            btnLoading?.classList.add("hidden");
            submitBtn.disabled = false;
        }
    });
}

// Initialize
initCtaForm();

// Support Astro View Transitions
document.addEventListener('astro:after-swap', initCtaForm);
