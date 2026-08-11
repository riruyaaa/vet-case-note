const APPLY_API_URL = '/api/apply';

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
