import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";


import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

import { CardDb } from '@/pages/Dashboard/components/card'
import { Flex,Typography } from "antd";
import {LineChartDb, TableChart} from  '@/pages/Dashboard/components/char'

const { Title } = Typography;

const DashboardPage = () => {
    // const { theme } = useTheme();

    return (
        <>
         <Flex justify="space-between" gap={'middle'}>
                <CardDb>
                    <Title level={1}>1</Title>
                    <p className="">Hoàn thành</p>
                    <p></p>
                </CardDb>
                <CardDb>
                    <Title level={1}>2</Title>
                    <p>Chưa hoàn thành</p>
                    <p></p>
                </CardDb>
                <CardDb>
                    <Title level={1}>0</Title>
                    <p>Trễ hạn</p>
                    <p></p>
                </CardDb>
                <CardDb>
                    <Title level={1}>4</Title>
                    <p>Tổng</p>
                    <p></p>
                </CardDb>
         </Flex>

       <Flex className="mt-3"  gap={'middle'}>
             <CardDb>
                <LineChartDb></LineChartDb>
             </CardDb>
             <CardDb>
                <TableChart></TableChart>
             </CardDb>
           
       </Flex>
        </>
    )
};

export default DashboardPage;
