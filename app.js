const APPLY_API_URL = '/api/apply';

document.querySelectorAll('.price-cta[data-plan]').forEach((link) => {
  link.addEventListener('click', () => {
    const cycleSelect = document.getElementById('cycle');
    if (cycleSelect) cycleSelect.value = link.dataset.plan;
  });
});

const applyForm = document.getElementById('applyForm');
if (applyForm) {
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = applyForm.querySelector('.submit-btn');
    const originalLabel = btn.textContent;
    btn.textContent = '전송 중...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(applyForm).entries());

    try {
      const res = await fetch(APPLY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        applyForm.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';

        const introTag = document.querySelector('.apply-intro .tag');
        const introHeading = document.querySelector('.apply-intro h2');
        const introLead = document.querySelector('.apply-intro .lead');
        if (introTag) introTag.style.display = 'none';
        if (introHeading) introHeading.style.display = 'none';
        if (introLead) {
          introLead.innerHTML = '협업 제안을 보내주셔서 감사합니다.<br>남겨주신 내용을 꼼꼼히 확인한 뒤,<br>기재해주신 연락처로 안내드릴게요.';
        }
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = '오류가 발생했어요. 다시 시도해주세요.';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalLabel; }, 2500);
    }
  });
}
