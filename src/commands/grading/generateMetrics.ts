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
  const csvRows = ["Class,Method,Earned Points,Total Points,Difference"];

  for (const classMetric of metricsCollection) {
    csvRows.push(`\n${classMetric.className} Class`);

    for (const [methodName, metrics] of classMetric.methods) {
      csvRows.push(
        `${methodName},${metrics.earned},${metrics.total},${metrics.difference}`,
      );
    }
  }

  const csvContent = csvRows.join("\n");
  try {
    Deno.writeTextFileSync("evaluation_metrics.csv", csvContent);
    console.log(yellow("\nMetrics CSV file generated: evaluation_metrics.csv"));
  } catch (error) {
    console.error("Error writing CSV file:", error);
  }
}

export function generateCombinedMetricsCSV(
  allMetrics: { folderName: string; metrics: SolutionMetrics }[],
) {
  const classNames = new Set<string>();
  const membersByClass = new Map<string, Set<string>>();

  for (const { metrics } of allMetrics) {
    for (const cls of metrics.classes) {
      classNames.add(cls.className);
      if (!membersByClass.has(cls.className)) {
        membersByClass.set(cls.className, new Set());
      }
      cls.methods.forEach((_methodMetrics, methodName) => {
        membersByClass.get(cls.className)!.add(methodName);
      });
    }
  }

  const classNamesArray = Array.from(classNames);

  const headerRow1: string[] = [];
  headerRow1.push("Solution");
  for (const className of classNamesArray) {
    const members = membersByClass.get(className) || new Set();
    for (let i = 0; i < members.size * 3; i++) {
      headerRow1.push(className);
    }
  }
  headerRow1.push("Total Score");

  const headerRow2: string[] = [];
  headerRow2.push("");
  for (const className of classNamesArray) {
    const members = Array.from(membersByClass.get(className) || []);
    for (const memberName of members) {
      headerRow2.push(memberName, memberName, memberName);
    }
  }
  headerRow2.push("");

  const headerRow3: string[] = [];
  headerRow3.push("");
  for (const className of classNamesArray) {
    const members = Array.from(membersByClass.get(className) || []);
    for (const _memberName of members) {
      // For each member, we push Earned/Total/Diff
      headerRow3.push("Earned", "Total", "Diff");
    }
  }
  headerRow3.push("");

  const csvRows: string[] = [
    headerRow1.join(","),
    headerRow2.join(","),
    headerRow3.join(","),
  ];

  for (const { folderName, metrics } of allMetrics) {
    const row: string[] = [];
    row.push(folderName);

    for (const className of classNamesArray) {
      const classMetrics = metrics.classes.find((c) =>
        c.className === className
      );

      const members = Array.from(membersByClass.get(className) || []);
      for (const memberName of members) {
        const member = classMetrics?.methods.get(memberName);

        if (member) {
          row.push(
            String(member.earned),
            String(member.total),
            String(member.difference),
          );
        } else {
          row.push("0", "0", "0");
        }
      }
    }

    row.push(String(metrics.totalScore));

    csvRows.push(row.join(","));
  }

  const csvContent = csvRows.join("\n");

  try {
    Deno.writeTextFileSync("all_solutions_metrics.csv", csvContent);
    console.log(
      "\nCombined metrics CSV file generated: all_solutions_metrics.csv",
    );
  } catch (error) {
    console.error("Error writing combined CSV file:", error);
  }
}
