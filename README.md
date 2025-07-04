# 역방향 튜터링 웹 서비스

## 배포 링크

**URL**: https://reverse-tutor-ai-insight.lovable.app

---

## 🎯 사용자 페르소나

| 항목 | 내용 |
|------|------|
| 이름 | 히포 |
| 나이 | 30세 |
| 전공 | 컴퓨터공학 |
| 목표 | 내가 알고 있는 내용을 설명해보며 메타인지를 높이고, 다음 학습 목표를 수립하고자 함 |
| 니즈 | 설명을 통해 지식의 공백을 인식하고, AI 피드백을 통해 학습 방향을 구체화하고 싶음 |

---

## 상황: 퇴근 후 노트북 앞에 앉은 히포

히포는 하루를 마무리하며 자신의 지식을 점검하고 싶다.  
오늘은 **"Spring의 빈 생명주기"**에 대해 설명해보면서  
내가 이해한 것이 정확한지 확인하려고 한다.

---

## 사용자 시나리오

1. 히포는 웹 브라우저에서 `https://lovable.dev/projects/ff44dd07-95b6-490b-babe-ab5c73edff9b` 웹사이트에 접속한다.
2. 메인 화면에서 학습 분야 별 버튼을 클릭한 후 `가르치기 시작하기` 버튼을 클릭한다
3. 교육 진행 상황에 교육하고자 하는 내용을 설명하고 하는 내용을 입력하고 가르치기를 통해 AI와 대화한다.
4. 가르치고자 하는 내용을 모두 입력하면 교육 종료하기를 클릭하고 교육을 종료한다.
6. 설명 제출 후, **교육 피드백** 화면에 교육 피드백 결과가 표시된다.
7. 히포는 몰랐던 개념을 인지하고, 추천 학습 주제를 확인한다.

---

## 사용자 스토리

> "컴퓨터공학을 공부하는 사람으로서,
> 저는 제가 설명할 수 있을 만큼 개념을 이해했는지를 테스트하고 싶습니다.  
> 그래야 지금 모르는 지점을 명확히 알고, 다음에 무엇을 공부할지 결정할 수 있기 때문입니다."

---

## 인수 조건

| 조건 | 내용 |
|------|------|
| Given | 사용자가 서비스에 로그인한 상태에서 |
| When | 사용자가 선택한 카테고리에 해당하는 학습 내용 설명을 완료한 후 제출 버튼을 클릭하면 |
| Then | 3초 이내에 AI가 다음과 같은 피드백을 제공해야 한다:  

1. 잘한 부분
2. 개선할 부분  
3. 개선 제안 사항
4. 다음 학습 단계
