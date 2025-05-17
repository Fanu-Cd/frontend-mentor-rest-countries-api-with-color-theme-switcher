import { Group, Text } from "@mantine/core";

const RenderKeyValue = ({
  itemKey,
  value,
  mode,
}: {
  itemKey: string;
  value: string | number;
  mode: "light" | "dark";
}) => {
  return (
    <Group gap={3}>
      <Text className={mode === "dark" ? "white-txt" : "gray-950-txt"}>
        {itemKey} :
      </Text>
      <Text className={mode === "dark" ? "gray-80-txt" : `gray-950-txt`}>
        {value}
      </Text>
    </Group>
  );
};

export default RenderKeyValue;
