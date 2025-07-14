window.addEventListener("DOMContentLoaded", function() {
      const simulatorForm = document.getElementById("simulatorForm");
      const resultsDiv = document.getElementById("results");
      const kioskGainElement = document.getElementById("kioskGainValue");
      const onlineGainElement = document.getElementById("onlineGainValue");
      const daysSlider = document.getElementById("days");
      const daysValueDisplay = document.getElementById("daysValue");
      const ticketsInput = document.getElementById("tickets");
      const basketInput = document.getElementById("basket");
      function updateSliderTrack() {
        const percent = (daysSlider.value / daysSlider.max) * 100;
        daysSlider.style.setProperty('--percent', percent + '%');
      }
      function animateCounter(element, targetValue, prefix = '', suffix = '') {
        element.classList.remove('animate-counter');
        const target = parseInt(targetValue.replace(/[^\d]/g, ''));
        const duration = 1000;
        const frameDuration = 1000/60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        const currentValue = 0;
        void element.offsetWidth;
        element.classList.add('animate-counter');
        const counter = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const easeProgress = -progress * (progress - 2);
          const value = Math.floor(easeProgress * target);
          element.textContent = `${prefix}${value.toLocaleString('fr-FR')}${suffix}`;
          if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = `${prefix}${target.toLocaleString('fr-FR')}${suffix}`;
          }
        }, frameDuration);
      }
      function calculateResults() {
        const tickets = parseInt(ticketsInput.value) || 0;
        const basket = parseFloat(basketInput.value) || 0;
        const daysPerWeek = parseInt(daysSlider.value) || 0;
        const daysPerMonth = daysPerWeek * 4.33;
        const totalTicketsPerMonth = tickets * daysPerMonth;
        const kioskOrderIncrease = 0.05;
        const kioskAdoptionRate = 0.70;
        const kioskBasketIncrease = 0.25;
        const kioskTickets = totalTicketsPerMonth * (1 + kioskOrderIncrease);
        let kioskGain = kioskTickets * kioskAdoptionRate * basket * kioskBasketIncrease;
        const onlineOrderIncrease = 0.18;
        const clickCollectTickets = totalTicketsPerMonth * onlineOrderIncrease;
        const clickCollectBasketIncrease = 0.30;
        const clickCollectAdoption = 0.80;
        let onlineGain = clickCollectTickets * basket;
        onlineGain += clickCollectTickets * basket * clickCollectBasketIncrease * clickCollectAdoption;
        const totalMonthlyGain = kioskGain + onlineGain;
        const totalAnnualGain = totalMonthlyGain * 12;
        const roundedKioskGain = Math.round(kioskGain);
        const roundedOnlineGain = Math.round(onlineGain);
        const roundedMonthlyGain = Math.round(totalMonthlyGain);
        const roundedAnnualGain = Math.round(totalAnnualGain);
        if (resultsDiv.style.display === "none") {
          resultsDiv.style.opacity = 0;
          resultsDiv.style.display = "block";
          setTimeout(() => {
            resultsDiv.style.transition = "opacity 0.5s ease";
            resultsDiv.style.opacity = 1;
            setTimeout(() => animateCounter(kioskGainElement, roundedKioskGain.toString(), '+', ' € / mois'), 100);
            setTimeout(() => animateCounter(onlineGainElement, roundedOnlineGain.toString(), '+', ' € / mois'), 300);
            setTimeout(() => animateCounter(document.getElementById("totalGainValue"), roundedMonthlyGain.toString(), '+', ' € / mois'), 500);
            setTimeout(() => animateCounter(document.getElementById("annualEstimate"), roundedAnnualGain.toString(), '(', ' € / an)'), 700);
          }, 50);
        } else {
          animateCounter(kioskGainElement, roundedKioskGain.toString(), '+', ' € / mois');
          animateCounter(onlineGainElement, roundedOnlineGain.toString(), '+', ' € / mois');
          animateCounter(document.getElementById("totalGainValue"), roundedMonthlyGain.toString(), '+', ' € / mois');
          animateCounter(document.getElementById("annualEstimate"), roundedAnnualGain.toString(), '(', ' € / an)');
        }
      }
      if (daysSlider && daysValueDisplay) {
        daysSlider.oninput = function() {
          daysValueDisplay.textContent = this.value;
          updateSliderTrack(); 
          calculateResults();
        }
      }
      if (ticketsInput) {
        ticketsInput.oninput = calculateResults;
      }
      if (basketInput) {
        basketInput.oninput = calculateResults;
      }
      updateSliderTrack();
      calculateResults();
    });