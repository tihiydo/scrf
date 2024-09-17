import ReactQueryProvider from "@/components/providers/react-query.provider";
import { fontsVariables } from "@/fonts";
import SessionProvider from "@/session/session.provider";
import { themeConfig } from "@/theme.config";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

type Props = {
    children: React.ReactNode;
}

export default async function AdminLayout({
    children,
}: Props) {
    return (
        <html lang={'en'} >
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body className={fontsVariables}>
                
                <ReactQueryProvider>
                    <SessionProvider>
                        <ConfigProvider
                            theme={themeConfig}
                        >
                            <AntdRegistry>
                                {children}
                            </AntdRegistry>
                        </ConfigProvider>
                    </SessionProvider>
                </ReactQueryProvider>
            </body>
        </html >
    );
}
