import { Container } from "@mantine/core";
import Main from "./pages/main";

export default function Home() {
  return (
    <Container fluid className="!w-full !min-h-screen !p-0 !m-0">
      <Main />
    </Container>
  );
}
