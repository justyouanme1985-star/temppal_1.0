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
                템빨(temppal.kr, 이하 "회사"라 함)은 서비스 제공을 위해 최소한의
                개인정보를 다음과 같은 목적으로 수집·이용합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>댓글 서비스 제공 (닉네임, 내용)</li>
                <li>문의 및 신고 접수 및 답변</li>
                <li>서비스 이용 통계 및 개선</li>
                <li>부적절한 게시물 모니터링 및 삭제</li>
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
                <li>
                  <strong>댓글 작성 시</strong>: 닉네임 (최대 20자), 댓글 내용
                  (최대 1,500자)
                </li>
                <li>
                  <strong>문의/신고 시</strong>: 이메일 주소, 문의 내용, 첨부
                  이미지
                </li>
                <li>
                  <strong>자동 수집</strong>: IP 주소, 브라우저 정보, 방문 일시
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                3. 개인정보의 보유 및 이용기간
              </h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>
                  <strong>댓글 정보</strong>: 댓글 삭제 시까지 (관리자에 의한
                  삭제 포함)
                </li>
                <li>
                  <strong>문의/신고 기록</strong>: 처리 완료 후 1년
                </li>
                <li>
                  <strong>자동 수집 정보</strong>: 수집 후 1년
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지
                않습니다. 다만, 법령에 의한 요구가 있는 경우 예외로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. 쿠키 및 광고</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 이용자 경험 개선 및 쿠팡 파트너스 광고 제공을 위해 쿠키를
                사용할 수 있습니다. 이용자는 브라우저 설정에서 쿠키 수집을
                거부할 수 있습니다. 다만, 쿠키 거부 시 서비스 이용에 제한이 있을
                수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. 이용자의 권리</h2>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">
                이용자는 다음과 같은 권리를 행사할 수 있으며, 이메일을 통해
                요청할 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>자신의 댓글 삭제 요청</li>
                <li>수집된 개인정보 열람 및 삭제 요청</li>
                <li>처리 거부 및 동의 철회</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. 개인정보 보호</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                회사는 개인정보 보호를 위해 데이터베이스 암호화, 접근 권한 관리
                등의 기술적·관리적 조치를 취하고 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                8. 개인정보 처리방침 변경
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                본 방침은 법률 변경 또는 서비스 정책 변경에 따라 수정될 수
                있으며, 변경 시 서비스 내 공지사항으로 고지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. 문의</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                개인정보 보호 관련 문의사항은 아래로 연락주시기 바랍니다:
              </p>
              <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <p className="font-semibold">템빨 개인정보 담당자</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  이메일: temppal2026@gmail.com
                </p>
              </div>
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
