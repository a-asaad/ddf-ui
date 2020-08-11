import * as React from 'react'
import {
  createMuiTheme,
  MuiThemeProvider as ThemeProvider,
  darken,
  getContrastRatio,
  Theme as ThemeInterface,
  createStyles,
  lighten,
  StylesProvider,
  fade,
} from '@material-ui/core/styles'
import { ThemeContext } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import {
  lighten as polishedLighten,
  meetsContrastGuidelines,
  mix,
} from 'polished'

type Theme = {
  primary: string
  secondary: string
  background: string
  paper: string
}

export const dark: Theme = {
  background: '#34434c',
  paper: '#213137',
  primary: '#69E1E8',
  secondary: '#dc004e',
}

export const light: Theme = {
  primary: '#3c6dd5',
  secondary: '#dc004e',
  background: '#e3e7e8',
  paper: '#f3fdff',
}

export const MuiOutlinedInputBorderClasses =
  'MuiOutlinedInput-root MuiOutlinedInput-multiline MuiOutlinedInput-notchedOutline border'

const GlobalStyles = createGlobalStyle<ThemeInterface>`
      a {
        color: inherit !important;
      }
      .MuiToolbar-root a,
      .MuiToolbar-root .MuiBreadcrumbs-separator {
        color: ${props =>
          props.palette.getContrastText(props.palette.primary.main)};
      }
      .MuiDrawer-root a {
        color: ${props =>
          props.palette.getContrastText(props.palette.background.paper)};
      }
      .MuiTooltip-tooltip {
        max-width: 50vw;
        padding: 0px;
        background-color: none;
      }
      .MuiFormControlLabel-labelPlacementStart {
        margin-left: 0px;
      }
      @media (min-width: 600px) {
        .MuiListItemIcon-root {
          margin-left: 8px;
        }
      }
      .lm_splitter  {
        background: ${props => props.palette.background.default} !important;
      }
      .lm_stack{
        box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
        background: ${props => props.palette.background.paper} !important;
        border-radius: 4px;
        transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      }
      .lm_header {
        z-index: 0 !important;
      }
      .is-drawing [role="tooltip"] {
        display: none!important;
      }
      [role="tooltip"] {
        z-index: 101 !important;
        pointer-events: all !important;
      }
      .bp3-portal {
        z-index: 101 !important;
      }
      .bp3-popover-wrapper,.bp3-popover-target, .bp3-control-group {
        width: 100%;
      }
      .bp3-control-group {
        flex-wrap: wrap;
      }
      .bp3-control-group > div:first-of-type::after {
        content: 'and';
        display:block;
        position: absolute;
        left: 14px;
        bottom: -25px;
      }
      .bp3-control-group > div:nth-of-type(2) {
        margin-top: 30px;
      }
      .bp3-input-group input {
        background: transparent !important; 
        box-shadow: none !important;
        font-size: 1.1428571428571428rem !important;
        padding: 0px !important;
        height: 1.3125rem !important;
        line-height: 1.15 !important;
      }
      .bp3-popover .bp3-popover-content, .bp3-popover .bp3-popover-content, .bp3-datepicker, .bp3-menu{
        background: ${props => props.palette.background.paper} !important;
      }
      .bp3-popover-arrow {
        display: none !important;
      }
      .bp3-datepicker .DayPicker-Day.DayPicker-Day--selected, .bp3-active {
        background-color: ${props => props.palette.primary.dark} !important;
      }
      
      // for whatever reason they have a height of 0 sometimes, maybe MUI will fix this in v5
      textarea.MuiInputBase-input {
        min-height: 21px;
      }
    `

const lightenUntilContrasting = (color: string, background: string): string => {
  const passes = meetsContrastGuidelines(color, background)
  if (passes.AA) {
    return color
  }
  return lightenUntilContrasting(lighten(color, 0.1), background)
}

const darkenUntilContrasting = (color: string, background: string): string => {
  const passes = meetsContrastGuidelines(color, background)
  if (passes.AA) {
    return color
  }
  return darkenUntilContrasting(darken(color, 0.1), background)
}

export const Provider = ({ children }: { children: any }) => {
  const styledTheme = React.useContext(ThemeContext)
  const darkMode = styledTheme.theme === 'dark'
  const paperColor = darkMode ? dark.paper : light.paper
  const backgroundColor = darkMode ? dark.background : light.background
  const customPalette = styledTheme.palette === 'custom'
  const primaryMain = customPalette
    ? styledTheme.primary
    : darkMode
      ? dark.primary
      : light.primary
  const secondaryMain = customPalette
    ? styledTheme.secondary
    : darkMode
      ? dark.secondary
      : light.secondary
  const primaryContrastScores = meetsContrastGuidelines(paperColor, primaryMain)
  const secondaryContrastScores = meetsContrastGuidelines(
    paperColor,
    secondaryMain
  )
  const failedContrastPrimaryReplacement = darkMode
    ? lightenUntilContrasting(primaryMain, paperColor)
    : darkenUntilContrasting(primaryMain, paperColor)
  const failedContrastSecondaryReplacement = darkMode
    ? lightenUntilContrasting(secondaryMain, paperColor)
    : darkenUntilContrasting(secondaryMain, paperColor)

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryMain,
      },
      secondary: {
        main: secondaryMain,
      },
      background: {
        default: backgroundColor,
        paper: paperColor,
      },
    },
    typography: {
      fontFamily: `'Open Sans', arial, sans-serif`,
      h6: {
        fontSize: '1.2rem',
      },
      fontSize: 16,
      button: {
        textTransform: 'none',
      },
    },
    overrides: {
      MuiButton: createStyles({
        root: {
          lineHeight: 'inherit', // maybe open a ticket on MUI, seems like the default they use doesn't center text quite right with icons
        },
        ...(primaryContrastScores.AA
          ? { textPrimary: {} } // weird requirement due to types, need textPrimary here but empty
          : {
              textPrimary: {
                color: failedContrastPrimaryReplacement,
                '&:hover': {
                  backgroundColor: fade(failedContrastPrimaryReplacement, 0.1),
                  // Reset on touch devices, it doesn't add specificity
                  '@media (hover: none)': {
                    backgroundColor: 'transparent',
                  },
                },
              },
            }),
        ...(secondaryContrastScores.AA
          ? { textSecondary: {} } // weird requirement due to types, need textPrimary here but empty
          : {
              textSecondary: {
                color: failedContrastSecondaryReplacement,
                '&:hover': {
                  backgroundColor: fade(
                    failedContrastSecondaryReplacement,
                    0.1
                  ),
                  // Reset on touch devices, it doesn't add specificity
                  '@media (hover: none)': {
                    backgroundColor: 'transparent',
                  },
                },
              },
            }),
      }),
      MuiCardActionArea: createStyles({
        root: {
          height: 'auto',
        },
      }),
      MuiCardHeader: createStyles({
        content: {
          minWidth: '0px',
        },
      }),
      MuiTooltip: createStyles({
        tooltip: {
          fontSize: '1rem',
        },
      }),
    },
    zIndex: {
      mobileStepper: 101,
      appBar: 101,
      drawer: 101,
      modal: 101,
      snackbar: 101,
      tooltip: 101,
    },
  })

  React.useEffect(
    () => {
      const htmlElement = document.querySelector('html') as HTMLElement
      if (styledTheme.theme === 'dark') {
        htmlElement.classList.add('bp3-dark')
      } else {
        htmlElement.classList.remove('bp3-dark')
      }
    },
    [styledTheme.theme]
  )
  return (
    <>
      <StylesProvider injectFirst>
        <GlobalStyles {...theme} />
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StylesProvider>
    </>
  )
}