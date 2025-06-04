import dynamic from "next/dynamic";

const ReturnClient = dynamic(() => import("./ReturnClient"), {
  ssr: false,
});

export default function ReturnPage() {
  return <ReturnClient />;
}
