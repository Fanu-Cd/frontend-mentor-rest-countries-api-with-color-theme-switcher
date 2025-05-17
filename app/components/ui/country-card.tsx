import { Box, Stack, Text } from "@mantine/core";
import RenderKeyValue from "./render-key-value";
import Image from "next/image";
import { Country } from "@/app/models/main";

const CountryCard = ({
  country,
  mode,
}: {
  country: Country;
  mode: "dark" | "light";
}) => {
  return (
    <Box
      className={`!w-full ${
        mode === "dark" ? "blue-900-bg" : "white-bg shadow-md"
      } rounded-md !min-h-[15rem]`}
    >
      <Box className="w-full h-[10rem] relative overflow-hidden">
        <Image
          src={country.flags?.svg}
          alt="Flag"
          sizes="100vw"
          fill
          objectFit="cover"
        />
      </Box>
      <Stack gap={1} p={20} mt={10}>
        <Text
          className={mode === "dark" ? "white-txt" : "gray-950-txt"}
          fw={"bold"}
        >
          {country.name?.common}
        </Text>
        <Box mt={5}>
          {[
            { itemKey: "Population", value: country.population },
            { itemKey: "Region", value: country.region },
            {
              itemKey: "Capital",
              value: Array.isArray(country.capital)
                ? country.capital[0]
                : country.capital,
            },
          ].map((item) => (
            <RenderKeyValue
              key={item.itemKey}
              itemKey={item.itemKey}
              value={item.value}
              mode={mode}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default CountryCard;
