import { BaseJavaCstVisitorWithDefaults } from "java-parser";
import {ExpectedStructure} from "./structure-types.ts";

export class JavaStructureVisitor extends BaseJavaCstVisitorWithDefaults {
    public structure: ExpectedStructure = { classes: [] };
    private currentClass: ExpectedStructure["classes"][0] | null = null;

    override typeIdentifier(ctx: any) {
        if (ctx.Identifier) {
            ctx.Identifier.forEach((identifier: any) => {
                const className = identifier.image;
                if (this.currentClass) {
                    this.structure.classes.push(this.currentClass);
                }
                this.currentClass = { name: className, fields: [], methods: [] };
            });
        }
        super.typeIdentifier(ctx);
    }

    override classMemberDeclaration(ctx: any) {
        if (!this.currentClass) {
            console.error("No active class to add members to.");
            return;
        }

        if (ctx.fieldDeclaration) {
            ctx.fieldDeclaration.forEach((fieldDeclaration: any) => {
                const fieldModifiers = fieldDeclaration.children.fieldModifier
                    ? this.fieldModifier(fieldDeclaration.children.fieldModifier)
                    : [];
                const fieldType = fieldDeclaration.children.unannType
                    ? this.unannType(fieldDeclaration.children.unannType)
                    : null;
                const fieldNames = fieldDeclaration.children.variableDeclaratorList
                    ? this.variableDeclaratorList(fieldDeclaration.children.variableDeclaratorList)
                    : [];

                fieldNames.forEach((fieldName) => {
                    if (fieldType) {
                        this.currentClass?.fields?.push({
                            name: fieldName,
                            type: fieldType,
                            modifiers: fieldModifiers,
                        });
                    }
                });
            });
        }
    }

    override ordinaryCompilationUnit(ctx: any) {
        super.ordinaryCompilationUnit(ctx);

        if (this.currentClass) {
            this.structure.classes.push(this.currentClass);
            this.currentClass = null;
        }
    }

    override fieldModifier(ctx: any): string[] {
        const modifiers: string[] = [];
        ctx.forEach((child: any) => {
            for (const key in child.children) {
                const modifierNodes = child.children[key];
                if (Array.isArray(modifierNodes)) {
                    modifierNodes.forEach((modifier: any) => {
                        if (modifier.image) {
                            modifiers.push(modifier.image);
                        }
                    });
                }
            }
        });
        return modifiers;
    }

    override unannType(ctx: any): string | null {
        let fieldType: string | null = null;
        ctx.forEach((child: any) => {
            const extractedType = this.extractType(child);
            if (extractedType) {
                fieldType = extractedType;
            }
        });
        return fieldType;
    }

    private extractType(node: any): string | null {
        if (!node || !node.children) return null;

        for (const key in node.children) {
            const childNodes = node.children[key];
            if (Array.isArray(childNodes)) {
                for (const child of childNodes) {
                    if (child.image) {
                        return child.image;
                    }
                    const result = this.extractType(child);
                    if (result) return result;
                }
            }
        }

        return null;
    }

    override variableDeclaratorList(ctx: any): string[] {
        const fieldNames: string[] = [];
        ctx.forEach((variableDeclarator: any) => {
            const variableDeclaratorId = variableDeclarator.children?.variableDeclarator?.[0]?.children?.variableDeclaratorId?.[0];
            const fieldName = this.extractFieldName(variableDeclaratorId);
            if (fieldName) {
                fieldNames.push(fieldName);
            }
        });
        return fieldNames;
    }

    private extractFieldName(variableDeclaratorId: any): string | null {
        if (!variableDeclaratorId?.children?.Identifier?.[0]?.image) return null;
        return variableDeclaratorId.children.Identifier[0].image;
    }
}
