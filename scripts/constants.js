// const OPENAI_PROXY_BASE_URL = 'https://openai-api-proxy-rtu664353a-uc.a.run.app'
const OPENAI_PROXY_BASE_URL = "http://127.0.0.1:5000"
const STORAGE = {
    AUTOMATED_TESTS: 'automated-tests',
    ELEMENT_PICKED: 'element-picked',
    ELEMENT_SOURCE: 'selected-element',
    FRAMEWORK_SELECTED: 'selected-framework',
    IDEAS: 'ideas',
    LANGUAGE_SELECTED: 'selected-language',
    POM: 'pom',
    SITE_URL: 'site-url',
    TEST_IDEAS: 'test-ideas'
};

const LANGUAGE = {
    CSHARP: 'C#',
    JAVA: 'Java',
    JAVASCRIPT: 'JavaScript',
    PYTHON: 'Python',
    TYPESCRIPT: 'TypeScript'
};

const FRAMEWORK = {
    CYPRESS: 'Cypress',
    PLAYWRIGHT: 'Playwright',
    SELENIUM: 'Selenium'
}

const ACTION = {
    ELEMENT_PICKED: 'element-picked',
    ELEMENT_SOURCE: 'element-source',
    HIGHLIGHT_ELEMENT: 'highlight-selected-element',
    START_PICKING: 'start-picking',
    UNHIGHLIGHT_ELEMENT: 'unhighlight-selected-element'
};

const MESSAGES = {
    API_DOWN: 'Our service is down, please check again later.',
    CHECKING_ACCESSIBILITY: 'Checking Accessibility<span class="ellipsis">...</span>',
    COPIED: 'Copied to Clipboard!',
    FAILED: 'Something happened, please try again :(',
    GENERATING_TEST_IDEAS: 'Generating Test Ideas<span class="ellipsis">...</span>',
    GENERATING_TESTS: 'Generating Tests<span class="ellipsis">...</span>',
    SUCCESS: 'Success!',
    TOO_LARGE: 'The element selected is too large, please try again with a smaller element.'
};

const RESULT = {
    ERROR: 'error',
    SUCCESS: 'success',
};

const ENDPOINTS = {
    AUTOMATE_IDEAS: '/api/automate-tests-ideas',
    AUTOMATE_TESTS: '/api/automate-tests',
    CHECK_ACCESSIBILITY: '/api/check-accessibility',
    GENERATE_TEST_IDEAS: '/api/generate-ideas',
    PING: '/api/ping'
};

const FEATURE = {
    AUTOMATE_IDEAS: 'automate-ideas',
    AUTOMATE_TESTS: 'automated-tests',
    CHECK_ACCESSIBILITY: 'check-accessibility',
    GENERATE_TEST_IDEAS: 'test-ideas'
};

const automateBtn = document.getElementById('generate-tests');
const checkAccessibilityBtn = document.getElementById('check-accessibility');
const ellipsis = document.getElementsByClassName('ellipsis');
const generateTestIdeasBtn = document.getElementById('generate-test-ideas');
const mainControls = document.getElementById('main-controls');
const pickerBtn = document.getElementById('start-picking');
const statusDescription = document.getElementById('status');
