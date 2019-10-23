import React, { Component } from "react";
import { getDecimal } from "../../utils/utils";

export const FormatNumber = ({ number }) => (
    <div>
        <span>{Math.floor(number)}</span>.
        <span style={{ fontSize: "14px" }}>{getDecimal(number)}</span>
    </div>
);