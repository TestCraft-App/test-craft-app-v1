# TestCraft Chrome Extension

[TestCraft](https://home.testcraft.app/) is a Chrome extension designed to be a companion to your software testing. With TestCraft, you can select UI elements directly from your browser and leverage the capabilities of large language models (LLMs) to generate innovative test ideas, write automation scripts across various frameworks and programming languages, and perform accessibility checks.

## Table of Contents
- [TestCraft Chrome Extension](#testcraft-chrome-extension)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Selecting Elements](#selecting-elements)
    - [Generating Test Ideas](#generating-test-ideas)
      - [Automate Test Ideas](#automate-test-ideas)
      - [Copy Test Ideas](#copy-test-ideas)
    - [Writing Automation Scripts](#writing-automation-scripts)
    - [Accessibility Checks](#accessibility-checks)
  - [API Configuration](#api-configuration)
    - [Automation Settings](#automation-settings)
    - [OpenAI API key](#openai-api-key)
    - [Server URL](#server-url)
    - [Select Your Model](#select-your-model)
  - [Support](#support)
  - [License](#license)

## Features
- **Pick Element**: Easily select any UI element directly from the webpage.
- **Generate Test Ideas**: Utilize LLMs to brainstorm diverse testing ideas and scenarios.
- **Automation**: Automatically generate test scripts in multiple languages and frameworks, including JavaScript, TypeScript, Java, C#, and Python, and using testing frameworks like Playwright, Cypress, and Selenium.
- **Check Accessibility**: Assess the accessibility of UI components to ensure compliance with standards and improve usability.

## Installation
1. Navigate to https://home.testcraft.app/
2. Click on Install
3. Click "Add to Chrome" to install the extension.
4. Click the Extensions icon in the browser toolbar, and pin the extension so that the TestCraft icon is always visible

## Usage
To open TestCraft, click on the TestCraft icon in the browser toolbar.

### Selecting Elements
   1. Click on the "Pick Element" button.
   2. Hover over the desired element on the webpage.
   3. Click to select the element. The element's details will be loaded into TestCraft for further action.

### Generating Test Ideas
   1. After selecting an element, click on "Generate Test Ideas".
   2. Review the suggested test ideas, categorized into Positive Tests, Negative Tests, and Creative Test Scenarios:
       - **Positive Tests**: Confirm that the system behaves as expected under normal conditions.
       - **Negative Tests**: Check how the system handles error conditions or invalid input.
       - **Creative Test Scenarios**: Explore less common conditions or combined inputs to uncover unique issues.
   3. Optionally, edit the suggested test ideas using the pencil icons next to each idea.

#### Automate Test Ideas
   1. Generate test ideas as described above.
   2. Use the checkboxes to select the test ideas you find relevant (optionally, you can edit them first).
   3. Click "Automate" to generate automation scripts based on the selected test ideas for the specific UI element.

#### Copy Test Ideas 
   1. Generate test ideas as described above.
   2. Use the checkboxes to select the test ideas you find relevant (optionally, you can edit them first).
   3. Click on "Copy to clipboard" to copy selected ideas for documentation or further processing.

### Writing Automation Scripts
   1. After selecting an element, click on "Automate" to generate the code.
   2. Copy the generated code directly into your IDE by clicking on "Copy to clipboard".

### Accessibility Checks
   1. After selecting an element, click on "Check Accessibility".
   2. Review the detailed report pointing out potential issues and recommendations for tests.

## API Configuration
In the Settings tab, you will find different configuration settings for the extension. To open it, click on the gear icon in the top left corner.

### Automation Settings
In this section, you can select your preferred language and testing framework 

### OpenAI API key
Entering the Open AI API key sets this key to be used for all OpenAI requests. 
Doing this also enables the dropdown to select more powerful models.
  - Enter your OpenAI API key on the first text input (the one with the placeholder "Your OpenAI API key").

For more information on how to create an API key, navigate to [OpenAI API Reference - Authentication](https://platform.openai.com/docs/api-reference/authentication)

### Server URL
Entering a server URL enables you to use your own TestCraft API deployed in your organization's infrastructure.
Doing this also enables the dropdown to select more powerful models.
  - Enter your server URL on the second text input (the one with the placeholder "Your server URL").

For more information on how to deploy the TestCraft API in your infrastructure, navigate to [TestCraft API Documentation](https://github.com/TestCraft-App/test-craft-api-v1?tab=readme-ov-file#testcraft-api)

### Select Your Model 
This dropdown allows you to select between the available models (more coming soon).  
  
Because of the costs involved, `gpt-3.5-turbo` is selected by default and the dropdown is disabled. To enable the other models, you need to set the [OpenAI API key](#openai-api-key) or the [Server URL](#server-url).  
  
For more information about OpenAI models, navigate to [OpenAI API Reference - Models](https://platform.openai.com/docs/models/overview)  
  
In case you want to explore other models without setting up the OpenAI API key or the server URL, contact us at contact@testcraft.app.  

## Support
For support or more information, please contact us at contact@testcraft.app.

## License
TestCraft is licensed under MIT License, and its use is subject to the terms and conditions stated in the license agreement.
