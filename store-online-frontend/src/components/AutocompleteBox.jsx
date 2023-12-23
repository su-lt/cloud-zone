import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";

const AutocompleteBox = ({ items, selected, setSelected }) => {
    const [query, setQuery] = useState("");

    const filter =
        query === ""
            ? items
            : items.filter((item) =>
                  item.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    return (
        <div className="w-full">
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <div className="relative mt-3 w-full border border-custom-500 rounded-sm cursor-default overflow-hidden text-left focus:outline-none">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0 dark:text-custom-1000"
                            displayValue={selected}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                                className="h-5 w-5 text-gray-800 dark:text-custom-1000"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filter.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : filter.length === 0 && query === "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                <>
                                    {filter.map((item) => (
                                        <Combobox.Option
                                            key={item.code}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-primary text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={item}
                                        >
                                            <span className={`block truncate`}>
                                                {item.name}
                                            </span>
                                        </Combobox.Option>
                                    ))}
                                </>
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
};

export default AutocompleteBox;
