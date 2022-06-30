import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export const SidebarContainer = styled.aside`
 position: fixed;
 z-index: 999;
 width: 100%;
 height: 100%;
 background: #0d0d0d;
 display: grid;
 align-items: center;
 top: 0;
 left: 0;
 transition: 0.4s ease-in-out;
 opacity: ${({ isOpen }) => (isOpen ? '96%' : '0')};
 top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
`;

export const CloseIcon = styled(FaTimes)`
    color: #ffffff;
`;

export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;
    outline: none;
`;

export const SidebarWrapper = styled.div`
    color: #fff;
`;

export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 70px);
    text-align: center;
    @media screen and (max-width: 480px) {
        grid-template-rows: repeat(8, 60px);
    }
`

export const SidebarLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition: 0.3s ease-in-out;
    text-decoration: none;
    color: #fff;
    cursor: pointer;
    &:hover {
        color: #143907;
        transition: 0.3s ease-in-out;
    }
`;

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
`;

export const SidebarRoute = styled(Link)`
    border-radius: 50px;
    background: #143907;
    white-space: nowrap;
    padding: 16px 64px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
    margin-top: 2rem;
    &:hover {
        transition: all 0.3s ease-in-out;
        background: #fff;
        color: #010606;
    }
`