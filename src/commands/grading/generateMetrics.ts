import { yellow } from "@std/fmt/colors";


export interface MethodMetrics {
    earned: number;
    total: number;
    difference: number;
}

export interface ClassMetrics {
    className: string;
    methods: Map<string, MethodMetrics>;
}

export interface SolutionMetrics {
    totalScore: number;
    classes: ClassMetrics[];
}

export function generateMetricsCSV(metricsCollection: ClassMetrics[]) {
    const csvRows = ['Class,Method,Earned Points,Total Points,Difference'];

    for (const classMetric of metricsCollection) {
        csvRows.push(`\n${classMetric.className} Class`);

        for (const [methodName, metrics] of classMetric.methods) {
            csvRows.push(
                `${methodName},${metrics.earned},${metrics.total},${metrics.difference}`
            );
        }
    }

    const csvContent = csvRows.join('\n');
    try {
        Deno.writeTextFileSync('evaluation_metrics.csv', csvContent);
        console.log(yellow('\nMetrics CSV file generated: evaluation_metrics.csv'));
    } catch (error) {
        console.error('Error writing CSV file:', error);
    }
}

// export function generateCombinedMetricsCSV(allMetrics: { folderName: string; metrics: ClassMetrics[] }[]) {
//     const csvRows = ['Class,Method,Earned Points,Total Points,Difference'];

//     for (const { folderName, metrics } of allMetrics) {
//         csvRows.push(`\n${folderName}`);

//         for (const classMetric of metrics) {
//             csvRows.push(`\n${classMetric.className} Class`);

//             for (const [methodName, metrics] of classMetric.methods) {
//                 csvRows.push(
//                     `${methodName},${metrics.earned},${metrics.total},${metrics.difference}`
//                 );
//             }
//         }
//     }

//     const csvContent = csvRows.join('\n');
//     try {
//         Deno.writeTextFileSync('all_solutions_metrics.csv', csvContent);
//         console.log(yellow('\nCombined metrics CSV file generated: all_solutions_metrics.csv'));
//     } catch (error) {
//         console.error('Error writing combined CSV file:', error);
//     }
// }


export function generateCombinedMetricsCSV(allMetrics: { folderName: string; metrics: SolutionMetrics }[]) {
    // First, collect all unique class names
    const classNames = new Set<string>();

    // For each class, gather the "member" names (methods + constructors)
    // Each member gets 3 columns: Earned, Total, Diff
    const membersByClass = new Map<string, Set<string>>();

    // Collect class and member names
    for (const { metrics } of allMetrics) {
        for (const cls of metrics.classes) {
            classNames.add(cls.className);
            if (!membersByClass.has(cls.className)) {
                membersByClass.set(cls.className, new Set());
            }
            // Add method names
            cls.methods.forEach((_methodMetrics, methodName) => {
                membersByClass.get(cls.className)!.add(methodName);
            });
        }
    }

    // Convert classNames to an array so we have a stable iteration order
    const classNamesArray = Array.from(classNames);

    // Build the 3 header rows
    // -- Row 1: "Solution", repeated className columns, "Total Score"
    // -- Row 2: blank under "Solution", repeated memberName for each column group, blank under "Total Score"
    // -- Row 3: blank under "Solution", repeated "Earned","Total","Diff", blank under "Total Score"

    // Row 1
    const headerRow1: string[] = [];
    headerRow1.push('Solution');
    for (const className of classNamesArray) {
        const members = membersByClass.get(className) || new Set();
        // Each member has 3 columns (Earned, Total, Diff)
        // So we repeat the class name 3 * (number of members)
        for (let i = 0; i < members.size * 3; i++) {
            headerRow1.push(className);
        }
    }
    headerRow1.push('Total Score');

    // Row 2
    const headerRow2: string[] = [];
    headerRow2.push(''); // blank under "Solution"
    for (const className of classNamesArray) {
        const members = Array.from(membersByClass.get(className) || []);
        for (const memberName of members) {
            // We will put the member name 3 times (one for each sub-column)
            headerRow2.push(memberName, memberName, memberName);
        }
    }
    headerRow2.push(''); // blank under "Total Score"

    // Row 3
    const headerRow3: string[] = [];
    headerRow3.push(''); // blank under "Solution"
    for (const className of classNamesArray) {
        const members = Array.from(membersByClass.get(className) || []);
        for (const _memberName of members) {
            // For each member, we push Earned/Total/Diff
            headerRow3.push('Earned', 'Total', 'Diff');
        }
    }
    headerRow3.push(''); // blank under "Total Score"

    // Collect all rows so far
    const csvRows: string[] = [
        headerRow1.join(','),
        headerRow2.join(','),
        headerRow3.join(',')
    ];

    // Now add data rows, one per solution
    for (const { folderName, metrics } of allMetrics) {
        const row: string[] = [];
        row.push(folderName); // first column

        // For each class in our known classNames array...
        for (const className of classNamesArray) {
            // Find this class in the current solution's metrics
            const classMetrics = metrics.classes.find(c => c.className === className);

            // Gather all members for that class
            const members = Array.from(membersByClass.get(className) || []);
            // For each member, push Earned, Total, Diff
            for (const memberName of members) {
                // First see if it's in methods
                const member = classMetrics?.methods.get(memberName);

                if (member) {
                    row.push(
                        String(member.earned),
                        String(member.total),
                        String(member.difference)
                    );
                } else {
                    // If missing, put 0,0,0
                    row.push('0', '0', '0');
                }
            }
        }

        // Finally, total score in the last column
        row.push(String(metrics.totalScore));

        csvRows.push(row.join(','));
    }

    // Turn into CSV
    const csvContent = csvRows.join('\n');

    // Write the file
    try {
        Deno.writeTextFileSync('all_solutions_metrics.csv', csvContent);
        console.log('\nCombined metrics CSV file generated: all_solutions_metrics.csv');
    } catch (error) {
        console.error('Error writing combined CSV file:', error);
    }
}
