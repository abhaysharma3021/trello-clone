import { startCase } from "lodash";

import { OrgControl } from "./_components/orgControl";
import { auth } from "@clerk/nextjs";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default LayoutPage;
