import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { type Organization } from "~/lib/schemas/organizations";

export default function OrganizationLogo({
  organization,
}: {
  organization?: Organization;
}) {
  // For single-word names, it uses the first two characters as initials.
  // For multi-word names, it joins the first letters of each word and takes the first two characters of this combined string.
  const organizationWords = organization?.name
    .toUpperCase()
    .split(" ")
    .map((word) => word[0])
    .filter((char) => char?.match(/[A-Z]|[0-9]/));
  const organizationInitials =
    organizationWords?.length === 1
      ? organization?.name.slice(0, 2).toUpperCase()
      : organizationWords?.join("").slice(0, 2);
  return (
    <Avatar>
      <AvatarImage src={organization?.logo} />
      <AvatarFallback delayMs={1000}>{organizationInitials}</AvatarFallback>
    </Avatar>
  );
}
