import React, { Component } from "react";
import { getDecimal } from "../../utils/utils";
import { formatNumber } from '../../utils/search/utils';

export const FormatNumber = ({ number }) => (
    <div>
        <span>{formatNumber(Math.floor(number))}</span>.
        <span style={{ fontSize: "14px" }}>{getDecimal(number)}</span>
    </div>
);