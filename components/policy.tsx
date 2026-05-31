export default function Policy() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
      <main className="pt-0">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-black tracking-tighter mb-10">
            이용약관
          </h1>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4">제1장 총칙</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">제1조 (목적)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    본 약관은 템빨(이하 "회사"라 함)이 제공하는 서비스의 이용과
                    관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을
                    규정함을 목적으로 합니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">제2조 (약관의 효력)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    본 약관은 서비스 화면에 게시함으로써 효력이 발생하며,
                    이용자가 서비스를 이용함으로써 약관에 동의한 것으로
                    간주됩니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                제2장 회원가입 및 이용계약
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    제3조 (회원의 권리와 의무)
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회원은 자신의 개인정보를 정확하게 제공해야 하며, 부정행위에
                    대해 책임을 집니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">제4조 (서비스 이용)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회사는 회원에게 안정적인 서비스를 제공하기 위해 노력하며,
                    연중 무휴 서비스를 제공함을 원칙으로 합니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제3장 거래관련 규정</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">제5조 (상품 정보)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회사가 제공하는 프로게이머 장비 정보는 참고용이며, 가격 및
                    스펙은 변동될 수 있습니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">제6조 (구매 및 결제)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회사는 외부 판매 사이트로 연결되는 링크만 제공하며, 실제
                    거래는 해당 사이트에서 이루어집니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제4장 책임제한</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">제7조 (면책조항)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회사는 외부 사이트의 상품 정보 정확성에 대해 책임지지
                    않으며, 거래 관련 분쟁은 해당 판매처와의 협의로 해결하여야
                    합니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제5장 기타</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">제8조 (약관 변경)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    회사는 필요에 따라 약관을 변경할 수 있으며, 변경 내용은
                    사전에 공지합니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">제9조 (준거법)</h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    본 약관은 대한민국 법률을 준거법으로 하며, 관할권은 회사의
                    본사 소재지를 관할하는 법원으로 합니다.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-zinc-300 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
              <p>시행일: 2026년 3월 30일</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
