"use client";

import ReactSelect from "react-select";

interface SelectAssigneeProps {
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
}

const SelectAssignee = ({
    value,
    onChange,
    options,
    disabled
}: SelectAssigneeProps) => {
    return (
        <div className="z-[100]">
            <div className="mt-2">
                <ReactSelect
                  isDisabled={disabled}
                  value={value}
                  onChange={onChange}
                  isMulti
                  options={options}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                    })
                  }}
                  classNames={{
                    control: () => "text-sm"
                  }}
                />
            </div>
        </div>
    );
}
 
export default SelectAssignee;