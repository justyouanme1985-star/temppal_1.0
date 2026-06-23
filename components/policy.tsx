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
              <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                본 약관은 템빨(temppal.kr, 이하 "회사"라 함)이 제공하는
                프로게이머 장비 정보 및 댓글 서비스(이하 "서비스"라 함)의 이용과
                관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을
                목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                제2조 (약관의 효력 및 동의)
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 이용자가
                서비스를 이용함으로써 본 약관에 동의한 것으로 간주됩니다. 회사는
                필요 시 약관을 변경할 수 있으며, 변경된 약관은 서비스 내
                공지사항을 통해 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제3조 (서비스의 내용)</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>
                  프로게이머 장비 정보 제공 (마우스, 키보드, 헤드셋, 모니터 등)
                </li>
                <li>선수별 사용 장비 및 랭킹 정보 제공</li>
                <li>이용자 간 댓글 및 답글 서비스</li>
                <li>장비 구매 링크 연결 (쿠팡 파트너스)</li>
                <li>문의 및 신고 접수 (이메일 temppal2026@gmail.com)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제4조 (서비스 이용)</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 연중무휴 서비스를 제공함을 원칙으로 하며, 시스템 점검
                등의 사유로 일시 중단될 수 있습니다. 회사가 제공하는 장비 정보는
                참고용이며, 실제 제품 스펙은 제조사 공식 정보를 확인하시기
                바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제5조 (댓글 서비스)</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                이용자는 댓글 작성 시 타인의 권리를 침해하거나 불쾌감을 주는
                내용을 게시해서는 안 됩니다. 회사는 관리자 권한으로 부적절한
                댓글을 사전 통보 없이 삭제할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                제6조 (외부 사이트 링크)
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 쿠팡 파트너스 등 외부 사이트로 연결되는 링크를
                제공합니다. 해당 링크를 통해 이루어지는 모든 거래는 해당
                사이트의 약관이 적용되며, 회사는 거래와 관련된 어떠한 책임도
                부담하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">제7조 (면책조항)</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 제공하는 정보의 정확성이나 완전성에 대해 보증하지 않으며,
                서비스 이용 중 발생한 손해에 대해 회사의 고의 또는 중과실이 없는
                한 책임을 부담하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                제8조 (준거법 및 관할)
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                본 약관은 대한민국 법률을 준거법으로 합니다. 서비스 이용과
                관련한 분쟁은 회사의 소재지를 관할하는 법원을 관할 법원으로
                합니다.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-zinc-300 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
              <p>시행일: 2026년 6월 24일</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
