'use client'

import { ThemeConfig, theme } from "antd";
import chroma from 'chroma-js';

const COLORS = {
    highlight: '#333333',
    primary: '#faff00',
    secondary: '#0d141f',
    primaryBg: '#151b26',
    primaryForeground: '#f2f2f2',
    gray: '#CBD5E1',
    red: '#f83440'
}

export const themeConfig: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: COLORS.primary,
        colorPrimaryText: COLORS.primary,
        colorError: COLORS.red,
    },
    components: {
        Message:
        {
            colorInfoBg: "#1d1d1d",
            colorInfoText: "#fffff",
            colorText: "#fffff"
        },
        Button: {
            defaultBg: 'transparent',
            defaultActiveBg: 'transparent',
            defaultHoverBg: 'transparent',
            // Default button
            defaultBorderColor: COLORS.highlight,

            defaultActiveBorderColor: chroma(COLORS.primary).darken(0.6).hex(),
            defaultActiveColor: chroma(COLORS.primary).darken(0.6).hex(),

            defaultHoverBorderColor: chroma(COLORS.primary).darken(1).hex(),
            defaultHoverColor: COLORS.primary,
        },
        Table:
        {
            colorBgLayout: "gray"
        },
        Select: {
            selectorBg: 'transparent',
            colorBorder: COLORS.primaryForeground,
            colorText: '#fff',
            colorTextDisabled: "#fff",
            borderRadius: 5,
        },
        Input: {
            borderRadiusLG: 5,
            colorBorder: COLORS.gray,
            activeBg: COLORS.secondary,
            addonBg: COLORS.secondary,
            colorBgContainer: COLORS.secondary,
            colorBgContainerDisabled: chroma(COLORS.secondary).alpha(0.95).hex(),
            paddingBlockLG: 18,
            paddingInlineLG: 20
        },
        Form: {
            itemMarginBottom: 30
        },
        Modal: {
            contentBg: COLORS.secondary,
            headerBg: COLORS.secondary,
            footerBg: COLORS.secondary
        },
        Alert: {
            colorErrorBorder: chroma(COLORS.red).alpha(0.4).hex(),
            colorErrorBg: chroma(COLORS.red).alpha(0.2).hex(),
        },
        Slider: {
            trackBg: COLORS.primary,
            trackHoverBg: COLORS.primary,
            railBg: COLORS.gray,
            railHoverBg: COLORS.gray,

            handleColor: COLORS.primary,
            handleActiveColor: COLORS.primary,
            dotBorderColor: COLORS.primary,
            dotActiveBorderColor: COLORS.primary,

            handleSize: 8,
            handleSizeHover: 8,
            handleLineWidthHover: 2,
        }
    }
}