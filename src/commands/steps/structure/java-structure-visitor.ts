import { BaseJavaCstVisitorWithDefaults } from "java-parser";
import { JavaStructure } from "./structure-types.ts";

export class JavaStructureVisitor extends BaseJavaCstVisitorWithDefaults {
  public structure: JavaStructure = { classes: [] };
  private currentClass: JavaStructure["classes"][0] | null = null;

  override normalClassDeclaration(ctx: any) {
    if (ctx.typeIdentifier) {
      const className = ctx.typeIdentifier[0].children.Identifier[0].image;
      if (this.currentClass) {
        this.structure.classes.push(this.currentClass);
      }
      this.currentClass = {
        name: className,
        fields: [],
        methods: [],
        constructors: [],
      };

      if (ctx.classExtends) {
        this.currentClass.extends =
          ctx.classExtends[0].children.classType[0].children.Identifier[0]
            .image;
      }

      if (ctx.classImplements) {
        this.currentClass.implements = ctx.classImplements[0].children
          .interfaceTypeList[0].children.interfaceType.map(
            (interfaceType: any) => {
              return interfaceType.children.classType[0].children.Identifier[0]
                .image;
            },
          );
      }
    }
    super.normalClassDeclaration(ctx);
  }

  override classBodyDeclaration(ctx: any) {
    if (!this.currentClass) {
      console.error("No active class to add members to.");
      return;
    }

    if (ctx.constructorDeclaration) {
      ctx.constructorDeclaration.forEach((constructorDeclaration: any) => {
        const constructorName = this.currentClass?.name || "UnnamedConstructor";
        const constructorDeclarator = constructorDeclaration.children
          .constructorDeclarator?.[0];
        const constructorParameters = constructorDeclarator
          ? this.formalParameterList(
            constructorDeclarator.children.formalParameterList?.[0],
          )
          : [];

        if (constructorName && constructorParameters) {
          this.currentClass?.constructors?.push({
            name: constructorName,
            parameters: constructorParameters,
          });
        }
      });
    }

    if (ctx.classMemberDeclaration) {
      ctx.classMemberDeclaration.forEach((classMemberDeclaration: any) => {
        if (classMemberDeclaration.children.fieldDeclaration) {
          classMemberDeclaration.children.fieldDeclaration.forEach(
            (fieldDeclaration: any) => {
              const fieldModifiers = fieldDeclaration.children.fieldModifier
                ? this.fieldModifier(fieldDeclaration.children.fieldModifier)
                : [];
              const fieldType = fieldDeclaration.children.unannType
                ? this.unannType(fieldDeclaration.children.unannType)
                : null;
              const fieldNames =
                fieldDeclaration.children.variableDeclaratorList
                  ? this.variableDeclaratorList(
                    fieldDeclaration.children.variableDeclaratorList,
                    true,
                  )
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
            },
          );
        }

        if (classMemberDeclaration.children.methodDeclaration) {
          classMemberDeclaration.children.methodDeclaration.forEach(
            (methodDeclaration: any) => {
              const methodModifiers = methodDeclaration.children.methodModifier
                ? this.fieldModifier(methodDeclaration.children.methodModifier)
                : [];
              const methodHeader = methodDeclaration.children.methodHeader?.[0];
              const methodReturnType = methodHeader
                ? this.unannType(methodHeader.children.result)
                : null;
              const methodName = methodHeader
                ? this.extractFieldName(
                  methodHeader.children.methodDeclarator?.[0],
                )
                : null;
              const methodParameters = methodHeader
                ? this.formalParameterList(
                  methodHeader.children.methodDeclarator?.[0].children
                    .formalParameterList?.[0],
                )
                : [];
              let methodExceptions: string[] = [];
              if (methodHeader?.children?.throws) {
                methodExceptions = this.parseThrows(
                  methodHeader.children.throws?.[0],
                );
              }
              if (methodName && methodReturnType) {
                this.currentClass?.methods?.push({
                  name: methodName,
                  returnType: methodReturnType,
                  modifiers: methodModifiers,
                  parameters: methodParameters,
                  exceptions: methodExceptions,
                });
              }
            },
          );
        }
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

  override formalParameterList(ctx: any): { type: string; name: string }[] {
    const parameters: { name: string; type: string }[] = [];

    if (ctx && ctx.children && ctx.children.formalParameter) {
      const formalParameters = ctx.children.formalParameter;
      if (Array.isArray(formalParameters)) {
        formalParameters.forEach((p: any) => {
          const param = p.children?.variableParaRegularParameter?.[0];
          const paramName = this.extractFieldName(
            param.children?.variableDeclaratorId?.[0],
          );
          const paramType = this.extractType(param.children?.unannType?.[0]);
          if (paramType && paramName) {
            parameters.push({ name: paramName, type: paramType });
          }
        });
      }
    }
    return parameters;
  }

  override variableDeclaratorList(ctx: any, field: boolean): string[] {
    let variableDeclaratorId: any;
    const fieldNames: string[] = [];
    ctx.forEach((variableDeclarator: any) => {
      if (field) {
        variableDeclaratorId = variableDeclarator.children?.variableDeclarator
          ?.[0]?.children?.variableDeclaratorId?.[0];
      } else {
        variableDeclaratorId = variableDeclarator.children?.methodDeclarator
          ?.[0];
      }
      const fieldName = this.extractFieldName(variableDeclaratorId);
      if (fieldName) {
        fieldNames.push(fieldName);
      }
    });
    return fieldNames;
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

  private extractFieldName(variableDeclaratorId: any): string | null {
    if (!variableDeclaratorId?.children?.Identifier?.[0]?.image) return null;
    return variableDeclaratorId.children.Identifier[0].image;
  }

  private parseThrows(throwsCtx: any): string[] {
    const exceptions: string[] = [];
    const exceptionTypeList = throwsCtx.children.exceptionTypeList?.[0];
    if (exceptionTypeList?.children?.exceptionType) {
      exceptionTypeList.children.exceptionType.forEach((exType: any) => {
        const exName = this.extractType(exType);
        if (exName) {
          exceptions.push(exName);
        }
      });
    }
    return exceptions;
  }
}
