import { use } from "react";
import { getData } from "@/utils/table";
import { columns } from "./Column";
import { DataTable } from "./DataTable";

export default function DemoPage() {
  const data = use(getData());
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
