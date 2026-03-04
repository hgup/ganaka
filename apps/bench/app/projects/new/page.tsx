import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Field, FieldDescription, FieldLabel, FieldLegend } from "@ui/field";
import { Separator } from "@ui/separator";
import { redirect } from "next/navigation";
import { createProjectProjectCreateProjectPost } from "@api/project/project";

const action = async (formData: FormData) => {
  "use server";
  const name = formData.get("projectName");
  if (typeof name !== "string")
    throw new Error('Mistek!')

    const {status,data} = await createProjectProjectCreateProjectPost({ name: name });
    if (status !== 200)
      throw new Error("Server Mistek!")

    redirect(`/projects/${data.id}`)
};

export default function NewProjectPage() {
  return (
    <div className="max-w-lg mx-auto p-10 flex flex-col justify-center">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-accent-foreground">Workbench</h1>
        <p className="text-muted-foreground pt-2">Add new project</p>
      </header>

      <div className="min-w-lg  mx-auto">
        {/* {state.error && (
          <div className="mb-8">
            <AlertDestructive title="Error" description={state.error} />
          </div>
        )} */}
        <form action={action}>
          <Field className="max-w-lg mb-8">
            <FieldLegend>Project Name</FieldLegend>
            <FieldLabel htmlFor="projectName">Name your project</FieldLabel>

            <Input type="text" id="projectName" name="projectName" required />
            <FieldDescription>Enter a memorable name.</FieldDescription>
            <Button name="step" value="1">
              {"Create new"}
            </Button>
          </Field>
          <Separator className="mt-16" />
        </form>
        <form>
          <Field className="max-w-lg">
            <FieldLegend className="mt-8 mb-4 text-muted-foreground text-center">
              Already have a project.db file?
            </FieldLegend>
            <Input type="file" id="file" name="file" accept=".csv" required />
            <FieldDescription>
              Upload Your project file to continue
            </FieldDescription>
            <Button name="step" value="1">
              {"Upload & Restore"}
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
