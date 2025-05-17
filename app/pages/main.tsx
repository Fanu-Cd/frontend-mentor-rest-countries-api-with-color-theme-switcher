"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconArrowNarrowLeft,
  IconChevronDown,
  IconMoonFilled,
  IconSearch,
  IconSun,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import CountryCard from "../components/ui/country-card";
import Skeleton from "../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getAllCountries } from "../lib/api/main";
import { Country } from "../models/main";
import { removeDuplicatesByRegion } from "../lib/utils/main";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import RenderKeyValue from "../components/ui/render-key-value";

const Main = () => {
  const [mode, setMode] = useState<"dark" | "light">("light");

  useEffect(() => {
    const modeFromLocalStorage = localStorage.getItem("mode");
    if (
      modeFromLocalStorage &&
      ["dark", "light"].includes(modeFromLocalStorage)
    ) {
      setMode(modeFromLocalStorage as "dark" | "light");
    }
  }, []);

  useEffect(() => {
    if (mode) localStorage.setItem("mode", mode);
  }, [mode]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-countries"],
    queryFn: getAllCountries,
  });

  const [regionFilter, setRegionFilter] = useState("_all");
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchInput] = useDebounce(searchString, 500);

  const finalData = useMemo(() => {
    let filteredData = data;
    if (regionFilter) {
      if (regionFilter !== "_all")
        filteredData = data?.filter(
          (x: { region: string }) => x.region === regionFilter
        );
      if (debouncedSearchInput && debouncedSearchInput.trim() !== "")
        filteredData = filteredData?.filter((x: { name: { common: string } }) =>
          x?.name?.common
            ?.toLowerCase()
            ?.includes(debouncedSearchInput?.toLocaleLowerCase().trim())
        );
    }
    return filteredData;
  }, [data, regionFilter, debouncedSearchInput]);

  const regions = useMemo(
    () =>
      removeDuplicatesByRegion(data)?.map((x: { region: string }) => ({
        value: x.region,
        label: x.region,
      })),
    [data]
  );

  const [selectedCountryForDetail, setSelectedCountryForDetail] =
    useState<Country | null>(null);

  return (
    <Container
      fluid
      className={`${
        mode === "dark" ? "blue-950-bg" : "white-bg"
      } !w-full !min-h-screen !p-0 !pb-5 !m-0`}
    >
      <Stack className="w-full h-full">
        <Flex
          justify={"space-between"}
          align={"center"}
          className={`${
            mode === "dark" ? "blue-900-bg" : "white-bg !shadow-md"
          } min-h-[4rem] px-10`}
        >
          <Text
            fw={"bold"}
            className={`${mode === "dark" ? "white-txt" : "gray-950-txt"} `}
          >
            Where in the world?
          </Text>
          <Group>
            <Button
              leftSection={
                mode === "light" ? (
                  <IconSun />
                ) : (
                  <IconMoonFilled size={"0.9rem"} />
                )
              }
              variant="transparent"
              className={`${mode === "dark" ? "white-txt" : "gray-950-txt"}`}
              onClick={() => {
                if (mode === "dark") return setMode("light");
                setMode("dark");
              }}
            >
              {mode == "dark" ? "Dark" : "Light"} Mode
            </Button>
          </Group>
        </Flex>
        {selectedCountryForDetail && (
          <Stack>
            <Box className="px-10" mt={10}>
              <Button
                leftSection={<IconArrowNarrowLeft />}
                variant={mode === "dark" ? "transparent" : "outline"}
                className={
                  mode === "dark"
                    ? "blue-900-bg white-txt"
                    : "white-bg gray-950-txt"
                }
                onClick={() => {
                  setSelectedCountryForDetail(null);
                }}
                color={mode === "dark" ? "" : "hsl(200, 15%, 8%)"}
              >
                Back
              </Button>
              <Grid mt={50}>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Box className="relative h-[15rem] md:w-[80%]">
                    <Image
                      src={selectedCountryForDetail.flags?.svg}
                      alt="Flag"
                      sizes="(min-width: 768px) 80%, 100vw"
                      fill
                      objectFit="cover"
                    />
                  </Box>
                </GridCol>
                <GridCol span={{ base: 12, md: 6 }}>
                  <Text
                    className={`${
                      mode === "dark" ? "white-txt" : "gray-950-txt"
                    } !text-2xl`}
                    fw={"bold"}
                  >
                    {selectedCountryForDetail?.name?.common}
                  </Text>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} mt={15}>
                    {[
                      {
                        itemKey: "Native Name",
                        value:
                          selectedCountryForDetail?.name?.nativeName?.eng
                            ?.official,
                      },
                      {
                        itemKey: "Population",
                        value: selectedCountryForDetail?.population,
                      },
                      {
                        itemKey: "Region",
                        value: selectedCountryForDetail?.region,
                      },
                      {
                        itemKey: "Sub Region",
                        value: selectedCountryForDetail?.subregion,
                      },
                      {
                        itemKey: "Capital",
                        value: Array.isArray(selectedCountryForDetail?.capital)
                          ? selectedCountryForDetail?.capital[0]
                          : selectedCountryForDetail?.capital,
                      },
                      {
                        itemKey: "Top Level Domain",
                        value: Array.isArray(selectedCountryForDetail?.tld)
                          ? selectedCountryForDetail?.tld[0]
                          : selectedCountryForDetail?.tld,
                      },
                      {
                        itemKey: "Currencies",
                        value: Object.keys(selectedCountryForDetail?.currencies)
                          ?.map(
                            (item) =>
                              selectedCountryForDetail?.currencies[item]?.name
                          )
                          ?.join(", "),
                      },
                      {
                        itemKey: "Languages",
                        value: Object.keys(selectedCountryForDetail?.languages)
                          ?.map(
                            (x: string) =>
                              selectedCountryForDetail?.languages[x]
                          )
                          ?.join(", "),
                      },
                    ]?.map((item) => (
                      <RenderKeyValue
                        key={item.itemKey}
                        itemKey={item.itemKey}
                        value={item.value}
                        mode={mode}
                      />
                    ))}
                  </SimpleGrid>
                  <Group mt={50} className="w-full" align="center">
                    <Text
                      className={`${
                        mode === "dark" ? `white-txt` : "gray-950-txt"
                      }`}
                      fw={"bold"}
                    >
                      Border Countries:{" "}
                    </Text>
                    {selectedCountryForDetail?.borders
                      ?.map(
                        (border) =>
                          data?.find((x: { cca3: string }) => x.cca3 === border)
                            ?.name?.common
                      )
                      ?.map((x) => (
                        <Box
                          key={x}
                          className={`${
                            mode === "dark"
                              ? "blue-900-bg white-txt"
                              : "white-bg gray-950-txt gray-400-border"
                          } p-2 rounded-md`}
                        >
                          {x}
                        </Box>
                      ))}
                  </Group>
                </GridCol>
              </Grid>
            </Box>
          </Stack>
        )}
        {!selectedCountryForDetail && (
          <Flex
            justify={"space-between"}
            align={"center"}
            className="px-10"
            direction={{ base: "column", md: "row" }}
            gap={{ base: 5, md: 0 }}
          >
            <TextInput
              leftSection={
                <IconSearch
                  size={"0.9rem"}
                  color={mode === "light" ? "hsl(0, 0%, 50%)" : "white"}
                />
              }
              placeholder="Search for a country..."
              styles={{
                input: {
                  background:
                    mode === "light"
                      ? "hsl(0, 100%, 100%)"
                      : "hsl(209, 23%, 22%)",
                  color:
                    mode === "light" ? "hsl(0, 0%, 50%)" : "hsl(0, 100%, 100%)",
                  border: 0,
                  boxShadow:
                    mode === "dark" ? "" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                  minHeight: "3rem",
                },
              }}
              classNames={{
                input:
                  mode === "light" ? "gray-placeholder" : "white-placeholder",
                root: "w-full md:!w-[30%]",
              }}
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              readOnly={isLoading || isError}
            />
            <Select
              styles={{
                input: {
                  background:
                    mode === "light"
                      ? "hsl(0, 100%, 100%)"
                      : "hsl(209, 23%, 22%)",
                  color:
                    mode === "light" ? "hsl(0, 0%, 50%)" : "hsl(0, 100%, 100%)",
                  border: 0,
                  minHeight: "3rem",
                },
                dropdown: {
                  background:
                    mode === "light"
                      ? "hsl(0, 100%, 100%)"
                      : "hsl(209, 23%, 22%)",
                  color:
                    mode === "light" ? "hsl(0, 0%, 50%)" : "hsl(0, 100%, 100%)",
                  border: 0,
                },
                option: {
                  background:
                    mode === "light"
                      ? "hsl(0, 100%, 100%)"
                      : "hsl(209, 23%, 22%)",
                  color:
                    mode === "light" ? "hsl(0, 0%, 50%)" : "hsl(0, 100%, 100%)",
                  border: 0,
                },
              }}
              rightSection={<IconChevronDown size={"0.9rem"} />}
              placeholder="Filter by Region"
              data={[
                { value: "_all", label: "All" },
                ...(regions ? regions : []),
              ]}
              value={regionFilter}
              onChange={(x) => {
                setRegionFilter(x as string);
              }}
              classNames={{ root: "w-full md:!w-[10%] shadow-md" }}
              readOnly={isLoading || isError}
            />
          </Flex>
        )}
        {!selectedCountryForDetail && (
          <Box className="px-10">
            <SimpleGrid
              cols={{ base: 1, md: 2, lg: 4 }}
              className="w-full"
              spacing={30}
            >
              {isLoading ? (
                Array.from([1, 2, 3, 4, 5, 6, 7, 8]).map((x) => (
                  <Skeleton key={x} />
                ))
              ) : isError ? (
                <Text
                  className={mode === "light" ? "gray-950-txt" : "white-txt"}
                >
                  Some Error Occurred While Fetching Countries, Try Refershing
                  The Page.
                </Text>
              ) : !finalData?.length ? (
                <Text
                  className={mode === "light" ? "gray-950-txt" : "white-txt"}
                >
                  No Result Found For The Keyword:{" "}
                  <Text className="inline italic" fw={"bold"}>
                    {searchString}
                  </Text>
                </Text>
              ) : (
                finalData?.map((country: Country, index: number) => (
                  <Box
                    key={index}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedCountryForDetail(country);
                    }}
                  >
                    <CountryCard country={country} mode={mode} />
                  </Box>
                ))
              )}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default Main;
