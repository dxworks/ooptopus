import { ClassEvaluation, InterfaceEvaluation, TestResults } from "./evaluating.model.ts";

interface ReportData {
  studentSolution: string;
  classEvaluations: ClassEvaluation[];
  interfaceEvaluations: InterfaceEvaluation[];
  testResults?: TestResults[];
  didCompile: boolean;
  totalScore: number;
  totalPoints: number;
  earnedPoints: number;
  gradingSchema: any;
}

function generateHTML(data: ReportData): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const scorePercentage = Math.round((data.earnedPoints / data.totalPoints) * 100);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Evaluation Report</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/java.min.js"></script>
    <style>
        :root {
            --success-color: #4CAF50;
            --error-color: #f44336;
            --warning-color: #ff9800;
            --text-color: #333;
            --bg-color: #f5f5f5;
            --card-bg: #ffffff;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--bg-color);
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background-color: var(--card-bg);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }

        .score {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }

        .section {
            background-color: var(--card-bg);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: var(--text-color);
            border-bottom: 2px solid var(--bg-color);
            padding-bottom: 10px;
        }

        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
        }

        .status-success {
            background-color: var(--success-color);
            color: white;
        }

        .status-error {
            background-color: var(--error-color);
            color: white;
        }

        .code-block {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            overflow-x: auto;
            margin: 10px 0;
        }

        .feedback {
            margin: 10px 0;
            padding: 10px;
            border-left: 4px solid var(--warning-color);
            background-color: #fff3e0;
        }

        .collapsible {
            cursor: pointer;
            padding: 10px;
            background-color: #f1f1f1;
            border: none;
            text-align: left;
            outline: none;
            width: 100%;
            margin-bottom: 5px;
            border-radius: 4px;
            position: relative;
        }

        .collapsible:hover {
            background-color: #ddd;
        }

        .collapsible::after {
            content: '▼';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.2s;
        }

        .collapsible.active::after {
            transform: translateY(-50%) rotate(180deg);
        }

        .content {
            padding: 0 18px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.2s ease-out;
        }

        .active {
            max-height: 500px;
        }

        .code-snippet {
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .code-snippet pre {
            margin: 0;
            padding: 10px;
        }

        .code-snippet-header {
            background-color: #f5f5f5;
            padding: 5px 10px;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .evaluation-log {
            margin: 10px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-family: monospace;
        }

        .attribute-list {
            list-style: none;
            padding: 0;
            margin: 10px 0;
        }

        .attribute-list li {
            margin: 5px 0;
            padding: 5px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .test-result {
            margin: 5px 0;
            padding: 8px;
            font-family: monospace;
        }

        .test-result.total {
            margin-top: 15px;
            font-weight: bold;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }

        .class-test-results {
            margin: 15px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .class-test-results h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Code Evaluation Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <div class="score">
                Score: ${scorePercentage}% (${data.earnedPoints}/${data.totalPoints} points)
            </div>
            <button class="collapsible">View Source Code</button>
            <div class="content">
                <div class="code-snippet">
                    <pre><code class="language-java">${data.studentSolution}</code></pre>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Compilation Status</h2>
            <div class="status ${data.didCompile ? 'status-success' : 'status-error'}">
                ${data.didCompile ? 'Compilation Successful' : 'Compilation Failed'}
            </div>
        </div>

        ${generateInterfacesSection(data.interfaceEvaluations)}
        ${generateClassesSection(data.classEvaluations)}
        ${generateTestsSection(data.testResults, data.gradingSchema, data.classEvaluations)}
        
        <div class="section">
            <h2 class="section-title">Summary</h2>
            <div class="feedback">
                <h3>Overall Performance</h3>
                <p>Total Score: ${scorePercentage}%</p>
                <p>Points Earned: ${data.earnedPoints}</p>
                <p>Total Possible Points: ${data.totalPoints}</p>
            </div>
        </div>
    </div>

    <script>
        document.querySelectorAll('.collapsible').forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });

        // Initialize syntax highlighting
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        });
    </script>
</body>
</html>`;
}

function generateInterfacesSection(interfaces: InterfaceEvaluation[]): string {
  if (!interfaces.length) return '';

  return `
    <div class="section">
        <h2 class="section-title">Interface Evaluations</h2>
        ${interfaces.map(iface => `
            <button class="collapsible">Interface: ${iface.id}</button>
            <div class="content">
                <ul class="attribute-list">
                    <li>Name: ${iface.nameCorrect ? '✅' : '❌'}</li>
                    <li>Extends: ${iface.extendsCorrect ? '✅' : '❌'}</li>
                </ul>
                
                <h3>Methods</h3>
                ${iface.methodsCorrect.map(method => `
                    <div class="feedback">
                        <h4>${method.methodName}</h4>
                        <ul>
                            <li>Name: ${method.correctName ? '✅' : '❌'}</li>
                            <li>Parameters: ${method.correctParams ? '✅' : '❌'}</li>
                            <li>Return Type: ${method.correctReturnType ? '✅' : '❌'}</li>
                            <li>Modifiers: ${method.correctModifiers ? '✅' : '❌'}</li>
                            <li>Exceptions: ${method.correctExceptions ? '✅' : '❌'}</li>
                        </ul>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>`;
}

function generateClassesSection(classes: ClassEvaluation[]): string {
  if (!classes.length) return '';

  return `
    <div class="section">
        <h2 class="section-title">Class Evaluations</h2>
        ${classes.map(cls => `
            <button class="collapsible">Class: ${cls.id}</button>
            <div class="content">
                <ul class="attribute-list">
                    <li>Name: ${cls.nameCorrect ? '✅' : '❌'}</li>
                    <li>Extends: ${cls.extendsCorrect ? '✅' : '❌'}</li>
                    <li>Implements: ${cls.implementsCorrect ? '✅' : '❌'}</li>
                    <li>Modifiers: ${cls.modifiersCorrect ? '✅' : '❌'}</li>
                </ul>

                <h3>Fields</h3>
                ${cls.fieldsCorrect.map(field => `
                    <div class="feedback">
                        <h4>${field.id}</h4>
                        <ul>
                            <li>Name: ${field.correctName ? '✅' : '❌'}</li>
                            <li>Type: ${field.correctType ? '✅' : '❌'}</li>
                            <li>Modifiers: ${field.correctModifiers ? '✅' : '❌'}</li>
                        </ul>
                    </div>
                `).join('')}

                <h3>Methods</h3>
                ${cls.methodsCorrect.map(method => `
                    <div class="feedback">
                        <h4>${method.methodName}</h4>
                        <ul>
                            <li>Name: ${method.correctName ? '✅' : '❌'}</li>
                            <li>Parameters: ${method.correctParams ? '✅' : '❌'}</li>
                            <li>Return Type: ${method.correctReturnType ? '✅' : '❌'}</li>
                            <li>Modifiers: ${method.correctModifiers ? '✅' : '❌'}</li>
                            <li>Exceptions: ${method.correctExceptions ? '✅' : '❌'}</li>
                        </ul>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>`;
}

function generateTestsSection(tests: TestResults[] | undefined, gradingSchema: any, classEvaluations: ClassEvaluation[]): string {
  if (!tests?.length) return '';

  // Group tests by class and method
  const testsByClass = new Map<string, Map<string, { passed: number; total: number }>>();
  let totalTestsPassed = 0;
  let totalTests = 0;
  
  // First, collect all test results by class and method from the grading schema
  for (const className in gradingSchema.classes) {
    const classSchema = gradingSchema.classes[className];
    const classMethods = new Map<string, { passed: number; total: number }>();
    
    for (const methodName in classSchema.methods) {
      const methodSchema = classSchema.methods[methodName];
      if (methodSchema.tests) {
        const methodTests = methodSchema.tests;
        const totalTestsForMethod = Object.keys(methodTests).length;
        
        // Only process methods that have tests
        if (totalTestsForMethod > 0) {
          let passedTests = 0;
          
          // Count passed tests by matching exact test names
          for (const testName in methodTests) {
            const testResult = tests.find(t => t.name === testName);
            if (testResult?.passed) {
              passedTests++;
              totalTestsPassed++;
            }
            totalTests++;
          }
          
          classMethods.set(methodName, { passed: passedTests, total: totalTestsForMethod });
        }
      }
    }
    
    if (classMethods.size > 0) {
      testsByClass.set(className, classMethods);
    }
  }

  return `
    <div class="section">
        <h2 class="section-title">Test Results</h2>
        ${Array.from(testsByClass.entries()).map(([className, methods]) => `
            <div class="class-test-results">
                <h3>${className}</h3>
                ${Array.from(methods.entries()).map(([methodName, { passed, total }]) => `
                    <div class="test-result">
                        ${methodName}: ${passed}/${total} tests passed
                    </div>
                `).join('')}
            </div>
        `).join('')}
        <div class="test-result total">
            Total: ${totalTestsPassed}/${totalTests} tests passed
        </div>
    </div>`;
}

export async function generateEvaluationReport(
  data: ReportData,
  outputPath?: string
): Promise<void> {
  const html = generateHTML(data);
  
  // Create reports directory if it doesn't exist
  try {
    await Deno.mkdir("reports", { recursive: true });
  } catch (err) {
    // Directory might already exist, which is fine
  }
  
  // If no output path is provided, use the folder name from the source path
  if (!outputPath) {
    const sourcePath = data.studentSolution.split('\n')[0]; // First line contains the path
    const folderName = sourcePath.split(/[/\\]/).slice(-2)[0]; // Get the folder name
    outputPath = `reports/${folderName}_evaluation_report.html`;
  } else {
    // If output path is provided, still put it in reports directory
    outputPath = `reports/${outputPath}`;
  }
  
  await Deno.writeTextFile(outputPath, html);
  console.log(`Evaluation report generated: ${outputPath}`);
} 
