export const ReactSelectStyleKrph = {
  menuPortal: (base) => ({ ...base, zIndex: "9999999999 !important" }),

  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? "#e9ecef !important" : "#fff!important",
    minHeight: "32px!important",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0 125 250 / 30%)" : null,
    borderColor: state.isFocused ? "#0071e3" : "#D6DBDF!important",
    fontSize: "11px!important",
    padding: "0px 0px 0px 6px!important",
    color: "#3f4254!important",
    borderRadius: "8px !important",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "32px!important",
    width: "150px !important",
    padding: "0 6px 0 2px!important",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "11px!important",
    color: "#3f4254",
  }),

  placeholder: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "13px!important",
    color: "#3f4254!important",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "32px!important",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#50c6d0" : null,
    color: state.isSelected ? "#fff" : "#3f4254",
    backgroundColor: state.isFocused ? "#50c6d0" : null,
    color: state.isFocused ? "#fff" : "#3f4254",
    fontSize: "13px!important",
    padding: "6px 12px 5px 12px!important",
    fontWeight: "400",
    fontFamily: "Poppins, Helvetica, 'sans-serif'",
    borderRadius: "2px !important",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "13px!important",
    padding: "5px 8px!important",
    color: "#3f4254!important",
  }),

  menu: (provided) => ({
    ...provided,
    padding: "1px 4px",
    zIndex: "99999999",
    position: "absolute",
    borderRadius: "0px !important",
  }),
};

export const ReactMultiSelectStyleKrph = {
  menuPortal: (base) => ({ ...base, zIndex: "9999999999 !important" }),

  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? "#e9ecef !important" : "#fff!important",
    minHeight: "26px!important",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0 125 250 / 30%)" : null,
    borderColor: state.isFocused ? "#0071e3" : "#D6DBDF!important",
    fontSize: "12px!important",
    padding: "0px 0px 0px 0px!important",
    color: "#3f4254!important",
    borderRadius: "0px !important",
  }),

  valueContainer: (provided) => ({
    ...provided,
    minHeight: "26px!important",
    padding: "2px 0px 2px 6px!important",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "12px!important",
    color: "#3f4254",
  }),

  placeholder: (provided) => ({
    ...provided,
    margin: "1px 0px 0px 0px!important",
    fontSize: "12px!important",
    color: "#3f4254!important",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    minHeight: "26px!important",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#50c6d0" : null,
    color: state.isSelected ? "#fff" : "#3f4254",
    backgroundColor: state.isFocused ? "#50c6d0" : null,
    color: state.isFocused ? "#fff" : "#3f4254",
    fontSize: "12px!important",
    padding: "6px 12px 5px 12px!important",
    fontWeight: "400",
    fontFamily: "Poppins, Helvetica, 'sans-serif'",
    borderRadius: "2px !important",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "12px!important",
    padding: "5px 8px!important",
    color: "#3f4254!important",
  }),
  menu: (provided) => ({
    ...provided,
    padding: "1px 4px",
    zIndex: "99999999",
    position: "absolute",
    borderRadius: "0px !important",
  }),
};

export const customStylesKrph = {
  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? "#e9ecef !important" : "#fff!important",
    borderColor: "#D5D8DC!important",
    minHeight: "29px!important",
    boxShadow: state.isFocused ? null : null,
    fontSize: "14px!important",
    padding: "0.12rem 0rem 0.12rem 0.4rem!important",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "26px!important",
    padding: "0 6px!important",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "14px!important",
  }),

  placeholder: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "14px!important",
    color: "#3F4254!important",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "26px!important",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#50c6d0" : null,
    color: state.isSelected ? "#fff" : null,
    backgroundColor: state.isFocused ? "#50c6d0" : null,
    color: state.isFocused ? "#fff" : null,
    fontSize: "13px!important",
    padding: ".50rem 1rem!important",
    fontWeight: "400",
    fontFamily: "Poppins, Helvetica, 'sans-serif'",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "12px!important",
    padding: "5px 8px!important",
    color: "#3f4254",
  }),

  menu: (provided) => ({
    ...provided,
    marginTop: "-1.6px!important",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    boxShadow: null,
    border: "1px solid #D5D8DC!important",
  }),
};

export const PageBarSelectStyleKrph = {
  menuPortal: (base) => ({ ...base, zIndex: "9999999999 !important" }),

  control: (provided, state) => ({
    ...provided,
    background: state.isDisabled ? "#e9ecef !important" : "#fff!important",
    minHeight: "26px!important",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0 125 250 / 30%)" : null,
    borderColor: state.isFocused ? "#0071e3" : "#D6DBDF!important",
    fontSize: "12px!important",
    padding: "0px 0px 0px 6px!important",
    color: "#3f4254!important",
    borderRadius: "0px !important",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "26px!important",
    padding: "0 6px 0 2px!important",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "12px!important",
    color: "#3f4254",
  }),

  placeholder: (provided) => ({
    ...provided,
    margin: "0px!important",
    fontSize: "12px!important",
    color: "#3f4254!important",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "26px!important",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#50c6d0" : null,
    color: state.isSelected ? "#fff" : "#3f4254",
    backgroundColor: state.isFocused ? "#50c6d0" : null,
    color: state.isFocused ? "#fff" : "#3f4254",
    fontSize: "12px!important",
    padding: "6px 12px 5px 12px!important",
    fontWeight: "400",
    fontFamily: "Poppins, Helvetica, 'sans-serif'",
    borderRadius: "2px !important",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    fontSize: "12px!important",
    padding: "5px 8px!important",
    color: "#3f4254!important",
  }),

  menu: (provided) => ({
    ...provided,
    padding: "1px 4px",
    zIndex: "99999999",
    position: "absolute",
    borderRadius: "0px !important",
    marginTop: "-0.2px !important",
  }),
};
