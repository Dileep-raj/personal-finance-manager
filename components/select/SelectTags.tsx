"use client"

import { useId } from "react";
import CreatableSelect from "react-select/creatable";

const SelectTags = ({ ...props }: any) => {

  return (
    <CreatableSelect
      {...props}
      className="basic-single"
      classNamePrefix="select"
      placeholder="Add tags"
      isClearable={true}
      closeMenuOnSelect={false}
      defaultValue={[]}
      isMulti
      isSearchable={true}
      options={[]}
      instanceId={useId()}
    />
  )
}

export default SelectTags
