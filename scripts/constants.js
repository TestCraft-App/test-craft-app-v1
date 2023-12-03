const OPENAI_PROXY_BASE_URL = 'https://openai-api-proxy-rtu664353a-uc.a.run.app';

const STORAGE = {
    SITE_URL: 'site-url',
    ELEMENT_PICKED: 'element-picked',
    ELEMENT_SOURCE: 'selected-element',
    FRAMEWORK_SELECTED: 'selected-framework',
    LANGUAGE_SELECTED: 'selected-language',
    AUTOMATED_TESTS: 'automated-tests',
    TEST_IDEAS: 'test-ideas',
    POM: 'pom',
    IDEAS: 'ideas',
};

const OPTION = {
    CYPRESS: 'cypress',
    PLAYWRIGHT: 'playwright',
    SELENIUM: 'selenium',
    JAVASCRIPT: 'javascript',
    TYPESCRIPT: 'typescript',
    JAVA: 'java',
    CSHARP: 'csharp',
    PYTHON: 'python',
};

const ACTION = {
    ELEMENT_PICKED: 'element-picked',
    ELEMENT_SOURCE: 'element-source',
    START_PICKING: 'start-picking',
    HIGHLIGHT_ELEMENT: 'highlight-selected-element',
    UNHIGHLIGHT_ELEMENT: 'unhighlight-selected-element',
};

const MESSAGES = {
    GENERATING_TESTS: 'Generating Tests<span class="ellipsis">...</span>',
    GENERATING_TEST_IDEAS: 'Generating Test Ideas<span class="ellipsis">...</span>',
    CHECKING_ACCESSIBILITY: 'Checking Accessibility<span class="ellipsis">...</span>',
    SUCCESS: 'Success!',
    COPIED: 'Copied to Clipboard!',
    FAILED: 'Something happened, please try again :(',
    TOO_LARGE: 'The element selected is too large, please try again with a smaller element.',
};

const RESULT = {
    ERROR: 'error',
    SUCCESS: 'success',
};

const ENDPOINTS = {
    AUTOMATE_TESTS: '/api/automate-tests',
    AUTOMATE_IDEAS: '/api/automate-tests-ideas',
    GENERATE_TEST_IDEAS: '/api/generate-ideas',
    CHECK_ACCESSIBILITY: '/api/check-accessibility',
};

const FEATURE = {
    GENERATE_TEST_IDEAS: 'test-ideas',
    AUTOMATE_TESTS: 'automated-tests',
    AUTOMATE_IDEAS: 'automate-ideas',
    CHECK_ACCESSIBILITY: 'check-accessibility',
};

const mainControls = document.getElementById('main-controls');
const cypressBtn = document.getElementById('cypress');
const playwrightBtn = document.getElementById('playwright');
const seleniumBtn = document.getElementById('selenium');
const javascriptBtn = document.getElementById('javascript');
const typescriptBtn = document.getElementById('typescript');
const javaBtn = document.getElementById('java');
const csharpBtn = document.getElementById('csharp');
const pythonBtn = document.getElementById('python');
const pomOnBtn = document.getElementById('pom-on');
const pomOffBtn = document.getElementById('pom-off');
const pickerBtn = document.getElementById('start-picking');
const automateBtn = document.getElementById('generate-tests');
const generateTestIdeasBtn = document.getElementById('generate-test-ideas');
const checkAccessibilityBtn = document.getElementById('check-accessibility');
const statusDescription = document.getElementById('status');
const ellipsis = document.getElementsByClassName('ellipsis');
