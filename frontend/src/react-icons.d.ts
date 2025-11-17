// Type declarations for react-icons compatibility with React 19
declare module 'react-icons/md' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const MdEmail: IconType;
  export const MdLock: IconType;
  export const MdPerson: IconType;
  export const MdClose: IconType;
  export const MdWaterDrop: IconType;
  export const MdSchool: IconType;
  export const MdLocalHospital: IconType;
  export const MdReportProblem: IconType;
  export const MdAssignment: IconType;
  export const MdWork: IconType;
  export const MdLocationCity: IconType;
}

declare module 'react-icons/ai' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const AiOutlineLoading3Quarters: IconType;
}

declare module 'react-icons/bi' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const BiCheckCircle: IconType;
  export const BiTime: IconType;
}

declare module 'react-icons/gi' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const GiRoad: IconType;
}

declare module 'react-icons/hi' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const HiOutlinePencil: IconType;
  export const HiOutlineTrash: IconType;
  export const HiOutlineEye: IconType;
}

declare module 'react-icons/io5' {
  import { FC, SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = FC<IconBaseProps>;
  
  export const IoChevronForward: IconType;
}
