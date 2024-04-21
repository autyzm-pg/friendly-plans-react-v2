const translations = {
  planActivity: {
    planNamePlaceholder: 'Wpisz nazwę planu',
    newPlan: 'Nowy Plan #',
    shuffleTasks: 'Rotuj zadania',
  },
  header: {
    activeStudent: 'Aktywny uczeń',
    noStudentCreated: 'Kliknij ikonę ludzi po prawej stronie, aby utworzyć studenta.'
  },
  modeSetting: {
    title: 'Odblokuj opcję edycji',
    createPassword: 'Utwórz nowe hasło',
    regainAccess: 'Odzyskaj dostęp',
    enterPassword: 'Wpisz hasło',
    savePassword: 'Zapisz',
    confirmPassword: 'Zatwierdź',
    forgotPassword: 'Zapomniałeś hasła?',
    retryPassword: 'Spróbuj wprowadzić hasło ponownie',
    wrongPassword: 'Hasło niepoprawne',
    factoryPassword: 'Wpisz hasło fabryczne',
  },
  common: {
    cancel: 'ANULUJ',
    confirm: 'POTWIERDŹ',
    ok: 'OK',
    yes: 'TAK',
    email: 'Adres email',
    name: 'Twoja nazwa',
    password: 'Hasło',
    error: 'Błąd',
    success: 'Sukces',
    unknownError: 'Pojawił się nieznany błąd',
    addImage: 'DODAJ LOGO',
    language: 'pl-PL',
  },
  validation: {
    email: 'Adres email musi być poprawny',
    required: 'To pole jest wymagane',
    passwordLength: 'Hasło jest za krótkie',
    acceptRequired: 'Musisz zaakceptować nasze warunki korzystania z aplikacji',
    duplicatedPlan: 'Plan o podanej nazwie już istnieje',
    planNameRequired: 'Nazwa planu jest wymagana',
  },
  notifications: {
    channelName: 'Powiadomienia',
    channelDescription: 'Otrzymuj pilne powiadomienia dotyczące usługi',
  },
  signIn: {
    signIn: 'Zaloguj się',
    signInButton: 'Zaloguj się',
    signInAsAnonymous: 'Zaloguj się anonimowo',
    signUpTip: 'nie posiadasz konta?',
    anonymousTip: 'możesz również',
    forgotPassword: 'zapomniałeś hasła?',
  },
  signUp: {
    signUp: 'Zarejestruj się',
    signUpButton: 'Zarejestruj się',
    accept: 'Akcpetuję',
    termsOfUse: 'Warunki korzystania z aplikacji',
  },
  simpleTask: {
    setTimer: 'Ustaw czas trwania ćwiczenia',
  },
  interaction: {
    setTimer: 'Ustaw czas trwania interakcji',
  },
  break: {
    setTimer: 'Ustaw czas trwania przerwy',
  },
  resetPassword: {
    resetPassword: 'Zresetuj hasło',
    guide1: 'Podaj swój email w poniższym polu. Wyślemy Ci link do zresetowania hasła.',
    guide2: 'Po ustawieniu nowego hasła, zaloguj się nowo ustawionym hasłem na ekranie logowania.',
    resetPasswordButtonLabel: 'Zresetuj hasło',
    userNotFound: 'Nie znaleziono użytkownika dla podanego adresu email. Upewnij się, że podałeś adres email, na który dokonano rejestracji.',
    resetPasswordSuccess: 'Email z linkiem do resetowania hasła został wysłany. Po ustawieniu nowego hasła, zaloguj się nowo ustawionym hasłem na ekranie logowania.',
  },
  content: {
    content: 'Treść',
    contentList: 'Treści',
  },
  settings: {
    settings: 'Ustawienia',
    signOutTitle: 'Wyloguj się',
    signOutSubtitle: 'Po wylogowaniu się, musisz zalogować się ponownie',
    signOutAction: 'WYLOGUJ',
    signOutDialogTitle: 'Wyloguj się',
    signOutDialogDescription: 'Czy na pewno chcesz się wylogować?',
  },
  sidebar: {
    addTask: 'DODAJ POJEDYNCZE ZADANIE',
    addStudent: 'DODAJ STUDENTA',
    takeAPicture: 'ZRÓB ZDJĘCIE',
    recordSound: 'NAGRAJ DŹWIĘK',
  },
  studentList: {
    createStudent: 'DODAJ UCZNIA',
    screenTitle: 'Wybierz ucznia',
    search: 'Wyszukaj',
    dashboard: 'Uczniowie',
    studentNamePlaceholder: 'Wpisz nazwę ucznia...',
    removeStudentTitle: 'POTWIERDŹ',
    removeStudentDescription: 'Czy na pewno chcesz usunąć {{name}} z listy uczniów?\n Tej czynności nie można cofnąć.',
  },
  planList: {
    viewTitle: 'Wszystkie plany',
    createPlan: 'DODAJ NOWY PLAN',
    copyPlan: 'SKOPIUJ ISTNIEJĄCY PLAN',
    copyPlanScreenTitle: 'Wybierz plan do skopiowania',
    conjunction: 'lub',
    planNamePlaceholder: 'Muzykowanie',
    deletePlan: 'USUŃ PLAN',
    deletePlanDescription: 'Usunięcie planu jest nieodwracalne. Oznacza to również usunięcie wszystkich jego elementów.',
    copyPlanAction: 'SKOPIUJ ISTNIEJĄCY PLAN',
    addPlanAction: 'STWÓRZ NOWY PLAN',
  },
  planItemActivity: {
    viewTitleTask: 'Zadanie',
    viewTitleInteraction: 'Interakcja',
    viewTitleBreak: 'Przerwa',
    taskNamePlaceholder: 'Wpisz nazwę zadania',
    timerButton: 'USTAW TIMER',
    taskNameForChild: 'Wprowadź skrypt dla ucznia',
    addImage: 'DODAJ/USUŃ OBRAZEK',
    imageActionTakePhoto: 'ZRÓB ZDJĘCIE',
    imageActionDeletePhoto: 'USUŃ OBRAZEK',
    imageActionLibrary: 'WYBIERZ Z BIBLIOTEKI',
    imageActionEditPhoto: 'EDYTUJ OBRAZEK',
    imageActionBrowse: 'DODAJ Z URZĄDZENIA',
    imageLibraryTitle: 'Biblioteka zdjęć',
    newTask: 'Nowe Zadanie #',
    infoBox: 'Informacja',
    infoBoxNameForChild: 'W tym polu należy wpisać tekst, który będzie widoczny dla ucznia',
    alertTitle: 'Powiadomienie',
    alertMessageCreate: 'Utworzono zadanie',
    alertMessageUpdate: 'Zaktualizowano zadanie',
    complexTaskCoverInfo: 'To jest strona tytułowa zadania złożonego',
    complexTaskPhotoPlaceholder: 'Brak obrazka',
    complexTaskCover: 'OKŁADKA',
    complexTaskAddSubTaskButton: 'DODAJ PODZADANIE',
    addVoice: 'USTAW CZYTANIE TREŚCI',
    voiceActionAddRecord: 'DODAJ NAGRANIE',
    voiceActionSetLector: 'USTAW LEKTORA',
    voiceActionDeleteVoice: 'USUŃ CZYTANIE TREŚCI',
    voiceActionPlayAudio: 'PUŚĆ NAGRANIE',
    startRecording: 'ROZPOCZNIJ NAGRYWANIE',
    stopRecording: 'ZATRZYMAJ NAGRYWANIE',
    timerHour: 'godziny',
    timerMinutes: 'minuty',
    timerSeconds: 'sekundy',
  },
  updatePlan: {
    screenTitle: '{{studentName}} - Aktualizuj plan',
    removePlanTitle: 'POTWIERDŹ',
    removePlanDescription: 'Czy na pewno chcesz plan "{{name}}" z listy planów ucznia?\n Tej czynności nie można cofnąć.',
    addBreak: 'DODAJ PRZERWĘ',
    addInteraction: 'DODAJ INTERAKCJĘ',
    addTask: 'DODAJ ZADANIE',
    addSimpleTask: 'DODAJ POJEDYNCZE ZADANIE',
    addComplexTask: 'DODAJ ZŁOŻONE ZADANIE',
    planItemNamePlaceholder: 'Wpisz nazwę zadania...',
    saveTask: 'ZAPISZ',
  },
  studentSettings: {
    studentName: 'Imię ucznia',
    taskView: 'Widok zadań',
    soundSettings: 'Ustawienia dźwięku',
    settingsTitle: 'Ustawienia ucznia',
    createStudentTitle: 'Dodaj ucznia',
    textSettingsSizeS: 'Rozmiar tekstu: S',
    textSettingsSizeM: 'Rozmiar tekstu: M',
    textSettingsSizeL: 'Rozmiar tekstu: L',
    textSettingsSizeXL: 'Rozmiar tekstu: XL',
    largeImageSlide: 'Duży obrazek jako slajd',
    imageWithTextSlide: 'Obrazek z tekstem jako slajd',
    textSlide: 'Tylko tekst jako slajd',
    imageWithTextList: 'Obrazek z tekstem jako lista',
    textList: 'Tylko tekst jako lista',
    uppercase: 'Wielkie litery',
    blockSwipe: 'Blokada przejścia',
    alarmSound: 'Dźwięk timera',
    workInProgress: '(obecnie niedostępne)',
    planCardPlacehorder: 'Zagraj w papier, kamień, nożyce',
    studentNamePlaceholder: 'Wpisz imię ucznia',
    removeStudent: 'USUŃ UCZNIA',
    createStudent: 'DODAJ UCZNIA',
    deleteStudent: 'Usuń ucznia',
    deleteMessage: 'Usunięcie ucznia jest nieodwracalne. Oznacza też usunięcie wszystkich przypisanych do niego planów i zadań.',
    delete: 'USUŃ',
    cancel: 'ANULUJ',
  },
  runPlan: {
    next: 'Dalej',
    wait: 'Czekaj...',
  },
  taskTable: {
    number: '#',
    name: 'Nazwa',
    type: 'Typ',
    section: 'Części',
    time: 'Czas',
    delete: 'Usuń',
    edit: 'Edycja',
  },
  rest: {
    title: 'Przyjazny Plan',
  },
};

export default translations;
