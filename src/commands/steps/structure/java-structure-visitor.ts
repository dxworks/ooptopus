import { BaseJavaCstVisitorWithDefaults } from "java-parser";
import { JavaStructure } from "./structure-types.ts";

export class JavaStructureVisitor extends BaseJavaCstVisitorWithDefaults {
  public structure: JavaStructure = { classes: [], interfaces: [] };
  private currentClass: JavaStructure["classes"][0] | null = null;
  private currentInterface: JavaStructure["interfaces"][0] | null = null;

  override classDeclaration(ctx: any) {
    if (this.currentClass) {
      this.structure.classes.push(this.currentClass);
    }

    this.currentClass = {
      name: '',
      modifiers: [],
      fields: [],
      methods: [],
      constructors: [],
    };

    if (ctx.classModifier) {
      this.currentClass.modifiers = this.fieldModifier(ctx.classModifier);
    }

    super.classDeclaration(ctx);
  }

  override normalClassDeclaration(ctx: any) {
    if (ctx.typeIdentifier && this.currentClass) {
      const className = ctx.typeIdentifier[0].children.Identifier[0].image;
      this.currentClass.name = className;


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

  override normalInterfaceDeclaration(ctx: any) {
    if (ctx.typeIdentifier) {
      const interfaceName = ctx.typeIdentifier[0].children.Identifier[0].image;
      if (this.currentInterface) {
        this.structure.interfaces.push(this.currentInterface);
      }
      this.currentInterface = {
        name: interfaceName,
        methods: [],
        constants: []
      };

      if (ctx.interfaceExtends) {
        this.currentInterface.extends = ctx.interfaceExtends[0].children
          .interfaceTypeList[0].children.interfaceType.map(
            (interfaceType: any) => {
              return interfaceType.children.classType[0].children.Identifier[0]
                .image;
            },
          );
      }
    }
    super.normalInterfaceDeclaration(ctx);
  }

  override classBodyDeclaration(ctx: any) {
    if (!this.currentClass) {
      console.error("No active class to add members to.");
      return;
    }

    if (ctx.constructorDeclaration) {
      ctx.constructorDeclaration.forEach((constructorDeclaration: any) => {

        const constructorName = this.currentClass?.name || "UnnamedConstructor";
        const constructorDeclarator = constructorDeclaration.children.constructorDeclarator?.[0];
        const constructorParameters = constructorDeclarator
          ? this.formalParameterList(constructorDeclarator.children.formalParameterList?.[0])
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
              const methodModifiers =
                  methodDeclaration.children.methodModifier
                ? this.fieldModifier(methodDeclaration.children.methodModifier)
                : [];
              const methodHeader = methodDeclaration.children.methodHeader?.[0];
              const methodReturnType = methodHeader ? this.unannType(methodHeader.children.result)
                : null;
              const methodName = methodHeader
                ? this.extractFieldName(methodHeader.children.methodDeclarator?.[0])
                : null;
              const methodParameters = methodHeader
                ? this.formalParameterList(methodHeader.children.methodDeclarator?.[0].children.formalParameterList?.[0])
                : [];
              let methodExceptions: string[] = [];
              if (methodHeader?.children?.throws) {
                methodExceptions = this.parseThrows(methodHeader.children.throws?.[0]);
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

  override interfaceMemberDeclaration(ctx: any) {
    if (!this.currentInterface) {
      console.error("No active interface to add members to.");
      return;
    }

    // Handle interface methods
    if (ctx.interfaceMethodDeclaration) {
      ctx.interfaceMethodDeclaration.forEach(
        (methodDeclaration: any) => {
          const methodModifiers = methodDeclaration.children.interfaceMethodModifier
            ? this.fieldModifier(methodDeclaration.children.interfaceMethodModifier)
            : [];
          const methodHeader = methodDeclaration.children.methodHeader?.[0];
          const methodReturnType = methodHeader ? this.unannType(methodHeader.children.result)
            : null;
          const methodName = methodHeader
            ? this.extractFieldName(methodHeader.children.methodDeclarator?.[0])
            : null;
          const methodParameters = methodHeader
            ? this.formalParameterList(methodHeader.children.methodDeclarator?.[0].children.formalParameterList?.[0])
            : [];
          let methodExceptions: string[] = [];
          if (methodHeader?.children?.throws) {
            methodExceptions = this.parseThrows(methodHeader.children.throws?.[0]);
          }

          if (methodName && methodReturnType) {
            this.currentInterface?.methods?.push({
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

    // Handle interface constants
    if (ctx.constantDeclaration) {
      ctx.constantDeclaration.forEach(
        (constantDeclaration: any) => {
          const constantModifiers = constantDeclaration.children.constantModifier
            ? this.fieldModifier(constantDeclaration.children.constantModifier)
            : [];
          const constantType = constantDeclaration.children.unannType
            ? this.unannType(constantDeclaration.children.unannType)
            : null;
          const constantNames =
            constantDeclaration.children.variableDeclaratorList
              ? this.variableDeclaratorList(
                constantDeclaration.children.variableDeclaratorList,
                true,
              )
              : [];

          constantNames.forEach((constantName) => {
            if (constantType) {
              this.currentInterface?.constants?.push({
                name: constantName,
                type: constantType,
                modifiers: constantModifiers,
              });
            }
          });
        },
      );
    }

    super.interfaceMemberDeclaration(ctx);
  }

  override ordinaryCompilationUnit(ctx: any) {
    super.ordinaryCompilationUnit(ctx);
    if (this.currentClass) {
      this.structure.classes.push(this.currentClass);
      this.currentClass = null;
    }
    if (this.currentInterface) {
      this.structure.interfaces.push(this.currentInterface);
      this.currentInterface = null;
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

    if (Array.isArray(ctx)) {
      ctx.forEach((child: any) => {
        const extractedType = this.extractType(child);
        if (extractedType) {
          fieldType = extractedType;
        }
      });
    } else if (ctx) {
      const extractedType = this.extractType(ctx);
      if (extractedType) {
        fieldType = extractedType;
      }
    }

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
    const fieldNames: string[] = [];

    if (!ctx) return fieldNames;

    const variableDeclarators = Array.isArray(ctx) ? ctx : [ctx];

    variableDeclarators.forEach((variableDeclarator: any) => {
      let variableDeclaratorId: any;
      if (field) {
        variableDeclaratorId = variableDeclarator.children?.variableDeclarator?.[0]?.children?.variableDeclaratorId?.[0];
      } else {
        variableDeclaratorId = variableDeclarator.children?.methodDeclarator?.[0];
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
