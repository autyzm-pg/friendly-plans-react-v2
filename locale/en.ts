const translations = {
  forCopy: {
    noPlans: 'None of the available students have any plans created.'
  },
  planActivity: {
    planNamePlaceholder: 'Type schedule name',
    newPlan: 'New schedule #',
    shuffleTasks: 'Shuffle',
    lockTasks: '(Un)Lock',
    withoutBreaks: 'without breaks',
    deleteTasks: 'Delete',
    changeState: 'Change state',
    selectTasks: 'Select all',
    unSelectTasks: 'Unselect all',
    activeStatus: 'COMPLETED',
    notActiveStatus: 'UNFINISHED',
    deleteTaskHeader: 'DELETE TASK(S)',
    deleteTaskInfo: 'Deleting selected task(s) is irreversible. In the case of a complex task, it also means removing its subtasks.',
    completed: 'Did the student complete the task?',
    savedMessage: 'Saved',
    infoBoxTaskButtons: 'Select tasks (checkbox) to perform actions on them:',
    infoBoxTaskButtonsRotate: 'Shuffle the order of the selected tasks. A closed padlock means that tasks will not be mixed (even when marked).',
    infoBoxTaskButtonsLock: '(Un)Lock the selected tasks to mix their order.',
    infoBoxTaskButtonsDelete: 'Delete the selected tasks.',
    infoBoxTaskButtonsChangeState: 'Change task state - whether the selected tasks have been completed.'
  },
  header: {
    activeStudent: 'Active student',
  },
  timerSounds: {
    default: 'default',
    beep: 'beep',
    digital: 'digital',
    electronic: 'electronic',
    vibrate: 'vibrate'
  },
  modeSetting: {
    title: 'Unlock edition options',
    createPassword: 'Create new password',
    regainAccess: 'Regain access',
    enterPassword: 'Enter password',
    savePassword: 'Save',
    confirmPassword: 'Confirm',
    forgotPassword: 'Forgot password?',
    retryPassword: 'Try re-entering password',
    wrongPassword: 'Wrong password',
    factoryPassword: 'Enter factory password',
  },
  imageGallery: {
    zip: 'fpImages',
    title: 'Image gallery',
    information: 'Number of selected images',
    warningHeader: 'DELETE SELECTED IMAGES',
    warningInformation: 'Deleting selected images is irreversible. They will be removed from all tasks where they are used, as well as from the device memory.',
    usage: 'All images used at least once in any task (from device, camera or editing tool) are stored in the inner app gallery by default and can be reused later. If they are semi-visible, it means they are currently in use by one or multiple tasks. Click to choose which ones should be deleted.',
  },
  recGallery: {
    zip: 'fpRecordings',
    title: 'Recordings gallery',
    information: 'Number of selected recordings',
    warningHeader: 'DELETE SELECTED RECORDINGS',
    warningInformation: 'Deleting selected recordings is irreversible. They will be removed from all tasks where they are used, as well as from the device memory.',
    usage: 'All sounds used at least once in any task (from device or recorded) are stored in the inner app gallery by default and can be reused later. If they are semi-visible, it means they are currently in use by one or multiple tasks. Click to choose which ones should be deleted. Hold down to change name.',
    changeName: 'Change recording name',
    save: 'Save changes',
    find: 'Search by recording name',
  },
  export: {
    progress: 'Progress:',
    info: 'All data ({{size}}) will be exported to the Downloaded folder in ZIP format after acceptance. It is suggested to wait in the current view until the end of the export.',
    titleImg: 'Export images',
    titleRec: 'Export recordings',
    ready: 'Export finished'
  },
  common: {
    cancel: 'CANCEL',
    confirm: 'CONFIRM',
    ok: 'OK',
    yes: 'YES',
    no: 'NO',
    email: 'Email address',
    name: 'Your Name',
    password: 'Password',
    error: 'Error',
    success: 'Success',
    unknownError: 'Unknown error occured',
    addImage: 'ADD IMAGE',
    language: 'en-GB',
    required: 'Field required!',
    incorrectFileName: 'Name should not contain special characters!',
    addButton: 'Add',
    deleteButton: 'Remove',
    import: 'Import',
    export: 'Export',
  },
  validation: {
    email: 'Must be a valid email',
    required: 'This field is required',
    passwordLength: 'Password is too short',
    acceptRequired: 'You need to accept our Terms of Use',
    duplicatedPlan: 'Schedule name already exists',
    planNameRequired: 'Schedule name is required',
  },
  notifications: {
    channelName: 'Notifications',
    channelDescription: 'Get urgent notifications about the service',
  },
  signIn: {
    signIn: 'Sign In',
    signInButton: 'Sign In',
    signInAsAnonymous: 'Use the App as Guest',
    signUpTip: "don't have an account?",
    anonymousTip: 'you can also',
    forgotPassword: 'forgot password?',
  },
  signUp: {
    signUp: 'Sign Up',
    signUpButton: 'Sign up',
    accept: 'I accept',
    termsOfUse: 'Terms of Use',
  },
  simpleTask: {
    setTimer: 'Set the duration of the exercise',
  },
  interaction: {
    setTimer: 'Set the duration of the interaction',
  },
  break: {
    setTimer: 'Set the duration of the break',
  },
  resetPassword: {
    resetPassword: 'Reset password',
    guide1: 'Provide you email in the field below. We will send you link to reset your password.',
    guide2: 'After setting up new password, sign in with newly set password at the login screen.',
    resetPasswordButtonLabel: 'Reset Password',
    userNotFound: 'No user found for provided email. Make sure to provide email you registered.',
    resetPasswordSuccess: 'Email with password reset link has been sent. After setting up new password, sign in with newly set password at the login screen.',
  },
  content: {
    content: 'Content',
    contentList: 'Content List',
  },
  settings: {
    settings: 'Settings',
    signOutTitle: 'Sign out',
    signOutSubtitle: 'After you sign out, you will need to sign in again.',
    signOutAction: 'SIGN OUT',
    signOutDialogTitle: 'Sign out',
    signOutDialogDescription: 'Are you sure you want to sign out?',
  },
  sidebar: {
    addTask: 'ADD SIMPLETASK',
    addStudent: 'ADD STUDENT',
    takeAPicture: 'TAKE A PICTURE',
    recordSound: 'RECORD SOUND',
  },
  studentList: {
    createStudent: 'ADD A STUDENT',
    screenTitle: 'Select student',
    search: 'Search',
    dashboard: 'Student dashboard',
    studentNamePlaceholder: 'Enter Student name...',
    removeStudentTitle: 'CONFIRM',
    removeStudentDescription: 'Are you sure you want to remove \'{{name}}\' from your student list?\n This action cannot be undone.',
  },
  planList: {
    viewTitle: 'All schedules',
    createPlan: 'ADD NEW SCHEDULE',
    copyPlan: 'COPY EXISTING SCHEDULE',
    copyPlanScreenTitle: 'Select schedule to copy',
    conjunction: 'or',
    planNamePlaceholder: 'Singing',
    deletePlan: 'DELETE SCHEDULE',
    deletePlanDescription: 'Deleting a schedule is irreversible. It also means deleting all of its elements.',
    copyPlanAction: 'COPY EXISTING PLAN',
    addPlanAction: 'CREATE NEW PLAN',
    noTasks: 'NO TASKS',
    noTasksDescription: 'Plan \'{{name}}\' does not have any tasks',
    allTasksCompleted: 'All tasks are completed',
    allTasksCompletedDescription: 'All of the tasks in the plan \'{{name}}\' are completed.',
    playFromBeginning: 'Run from beginning',
    stateChangeInfo: 'Change the state of all tasks to unfinished (in the plan editing view) to enable running the plan again.',
  },
  planItemActivity: {
    viewTitleTask: 'Task',
    viewTitleInteraction: 'Interaction',
    viewTitleBreak: 'Break',
    taskNamePlaceholder: 'Type task name',
    timerButton: 'SET UP TIMER',
    taskNameForChild: 'Type task name for child',
    addImage: 'ADD/DELETE IMAGE',
    imageActionTakePhoto: 'TAKE A PHOTO',
    imageActionDeletePhoto: 'DELETE PHOTO',
    imageActionLibrary: 'ADD FROM APP LIBRARY',
    imageActionEditPhoto: 'EDIT PHOTO',
    imageActionBrowse: 'ADD FROM DEVICE',
    imageLibraryTitle: 'Image Library',
    newTask: 'New Task #',
    infoBox: 'Information',
    infoBoxNameForChild: 'In this field, enter text that will be visible to the child.',
    alertTitle: 'Notification',
    alertMessageCreate: 'Task created',
    alertMessageUpdate: 'Task updated',
    complexTaskCoverInfo: 'This is the title page of complex task.',
    complexTaskPhotoPlaceholder: 'No picture',
    complexTaskCover: 'COVER',
    complexTaskAddSubTaskButton: 'ADD SUBTASK',
    addVoice: 'SET CONTENT READING',
    voiceActionAddRecord: 'ADD CUSTOM RECORD',
    voiceActionSetLector: 'SET LECTOR',
    voiceActionDeleteVoice: 'DELETE CONTENT READING',
    voiceActionPlayAudio: 'PLAY AUDIO',
    useMicrophone: 'USE\nMIKE',
    timerHours: 'hours',
    timerMinutes: 'minutes',
    timerSeconds: 'seconds',
    saveSimpleTaskButton: 'SAVE TASK',
    saveComplexTaskButton: 'SAVE COMPLEX TASK',
    saveInteractionButton: 'SAVE INTERACTION',
    saveBreakButton: 'SAVE BREAK',
    nameForChildAsTaskName: 'Name identical as task content',
    alertMessageSaveQuestion: 'Do you want to save the changes made to this task?',
    alertMessageSaveQuestionTitle: 'Save changes?',
    alertMessageSaveQuestionSave: 'Save',
    alertMessageSaveQuestionDiscard: 'Discard',
    alertMessageTitleNoSubTasks: 'No subtasks',
    alertMessageNoSubTasks: 'You need to add at least one subtask.'
  },
  voiceRecorder: {
    title: 'Sound/voice recording',
    save: 'Save recording',
    fileName: 'newRecording',
    startRecording: 'Start recording',
    stopRecording: 'Stop recording',
    startPlaying: 'Listen to recording',
    stopPlaying: 'Stop recording'
  },
  updatePlan: {
    screenTitle: '\'{{studentName}}\' - Update a schedule',
    removePlanTitle: 'CONFIRM',
    removePlanDescription: 'Are you sure you want to schedule \'{{name}}\' from student schedule list?\n This action cannot be undone.',
    addBreak: 'ADD BREAK',
    addInteraction: 'ADD INTERACTION',
    addTask: 'ADD TASK',
    addSimpleTask: 'ADD SIMPLE TASK',
    addComplexTask: 'ADD COMPLEX TASK',
    planItemNamePlaceholder: 'Enter schedule item name...',
    saveTask: 'SAVE',
    saveSchedule: 'SAVE SCHEDULE',
    noScheduleNameError: 'Please provide a name for the schedule',
  },
  studentSettings: {
    studentName: "Student's name",
    taskView: "Task's view",
    soundSettings: 'Sound settings',
    settingsTitle: "Student's settings",
    createStudentTitle: 'Create a Student',
    textSettingsSizeS: 'Font size: S',
    textSettingsSizeM: 'Font size: M',
    textSettingsSizeL: 'Font size: L',
    textSettingsSizeXL: 'Font size: XL',
    largeImageSlide: 'Large image as a slide',
    imageWithTextSlide: 'Image with text label as a slide',
    textSlide: 'Just text as a slide',
    imageWithTextList: 'image with text label as a list',
    textList: 'Just text label as a list',
    uppercase: 'Uppercase letters',
    blockSwipe: 'Block swipe',
    alarmSound: 'Timer sound',
    workInProgress: '(currently unavailable)',
    planCardPlacehorder: "Let's play paper, rock, scissors",
    studentNamePlaceholder: 'Enter student name',
    removeStudent: 'REMOVE THE STUDENT',
    createStudent: 'CREATE A STUDENT',
    editStudent: 'SAVE CHANGES',
    deleteStudent: 'Delete student',
    deleteMessage: 'Deleting a student is irreversible. It also means deleting all schedules and tasks assigned to her/him.',
    delete: 'DELETE',
    cancel: 'CANCEL',
  },
  runPlan: {
    next: 'Next',
    wait: 'Wait...',
    oneSecondMore: 'One second more...'
  },
  taskTable: {
    number: '#',
    name: 'Name',
    type: 'Type',
    section: 'Parts',
    time: 'Time',
    delete: 'Delete',
    edit: 'Edit',
  },
  rest: {
    title: 'Friendly Schedule',
  },
};

export default translations;
