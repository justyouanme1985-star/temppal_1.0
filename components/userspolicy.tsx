export default function UserPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors">
      <main className="pt-0">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-black tracking-tighter mb-10">
            개인정보 처리방침
          </h1>

          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold mb-4">
                1. 개인정보의 수집 및 이용목적
              </h2>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                템빨(이하 "회사"라 함)은 다음과 같은 목적으로 개인정보를
                수집하여 이용합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>서비스 제공 및 운영</li>
                <li>이용자 식별 및 인증</li>
                <li>이용자 상담 및 문의 처리</li>
                <li>서비스 개선 및 통계</li>
                <li>법적 의무 준수</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                2. 수집하는 개인정보의 항목
              </h2>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                회사는 다음과 같은 개인정보를 수집합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>필수항목: 이름, 이메일, 휴대폰번호</li>
                <li>선택항목: 주소, 관심 게임, 선호 장비 유형</li>
                <li>자동수집: IP주소, 쿠키, 방문기록</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                3. 개인정보의 보유 및 이용기간
              </h2>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                개인정보는 다음과 같이 보관합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>회원정보: 회원 탈퇴 시까지</li>
                <li>거래정보: 거래 완료 후 5년</li>
                <li>상담기록: 상담 종료 후 1년</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                다만, 법정 의무에 따른 경우는 예외입니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. 개인정보의 보안</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 개인정보 보호를 위해 암호화, 접근제한 등의 기술적 조치를
                취하고 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. 이용자의 권리</h2>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                이용자는 다음과 같은 권리를 가집니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>개인정보 열람 및 수정 요청</li>
                <li>개인정보 삭제 요청</li>
                <li>개인정보 처리 거부</li>
                <li>개인정보 이전 요청</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. 쿠키와 추적기술</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 이용자 경험 개선을 위해 쿠키를 사용할 수 있습니다.
                이용자는 브라우저 설정으로 쿠키 수집을 거부할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                8. 개인정보 처리방침 변경
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                본 방침은 법률 변경 또는 회사 정책 변경에 따라 수정될 수 있으며,
                변경 사항은 사전에 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. 문의</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                개인정보 보호에 관한 문의사항은 다음으로 연락주시기 바랍니다:
              </p>
              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="font-semibold">템빨 개인정보 보호담당자</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  이메일: privacy@temppal.com
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  연락처: 1599-TEMPLATE
                </p>
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
