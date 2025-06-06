import { cn } from "@/lib/utils.ts";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {BankAccount} from "@/types/bank_user/bank-account.ts";
import React, {useState} from "react";
import {formatCurrency} from "@/lib/format-currency.ts";
import Wallet from "@/assets/Wallet.tsx";
import {RadialChart} from "@/components/__common__/RadialChart.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/swiper-bundle.css";

import {
    Autoplay, EffectCoverflow,
    Pagination,
} from "swiper/modules";
import {Role, User} from "@/types/bank_user/user.ts";
import ErrorFallback from "@/components/__common__/error/ErrorFallback.tsx";


interface BalanceCardProps extends React.ComponentProps<"div">{
    cardPageVersion?: boolean,
    account: BankAccount,
    income?: number,
    expenses?: number,
    onSendClick?: () => void,
    onDetailsClick?: () => void,
}


const BankAccountBalanceCard = ({ cardPageVersion=false, account, income=0, expenses=0, onSendClick, onDetailsClick, className, ...props }: BalanceCardProps) => {

    const user = sessionStorage.getItem("user");
    let parsedUser: User;
    if (user !== null) {
        parsedUser = JSON.parse(user);
    }
    else return <ErrorFallback message={"An error occurred"} />


    return (
        <Card
            className={cn(
                "border-0 h-full p-6 flex flex-col lg:flex-row lg:items-center justify-center ",
                className
            )}
            {...props}
        >
            <div>
                <div className="justify-center w-full flex flex-col">

                        {/*<h6 className="font-medium text-4xl font-heading mb-1">*/}
                        {/*    {*/}
                        {/*        formatCurrency(account.balance, account.currency.code)*/}
                        {/*    }*/}

                        {/*</h6>*/}
                    <Swiper
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        effect={"coverflow"}
                        coverflowEffect={{rotate: 90, slideShadows: false}}
                        loop={true}
                        rewind={true}
                        spaceBetween={30}
                        className="!max-w-full w-64 h-52 !max-h-full -mb-8"

                        modules={[ EffectCoverflow, Autoplay, Pagination]}
                    >

                        <SwiperSlide className="!flex !items-center !justify-baseline md:-ml-2">
                            <RadialChart title={`Account balance (${account.currency.code})`} total_balance={account.balance}
                                         available_balance={account.availableBalance} currencyCode={account.currency.code} />
                        </SwiperSlide>

                        {account.accountCurrencies.map((item, index) => (
                            <SwiperSlide className="!flex !items-center !justify-baseline">
                                <RadialChart title={`Account balance (${item.currency.code})`} total_balance={item.balance}
                                             available_balance={item.availableBalance} currencyCode={item.currency.code} />
                            </SwiperSlide>
                        ))}
                        {/*<p className="text-sm text-secondary-foreground font-paragraph">Account balance</p>*/}
                    </Swiper>

                    <div className="flex items-center justify-center lg:justify-start gap-7 py-9 font-paragraph">
                        <div className="flex items-center">
                            <Button variant="negative" className="cursor-auto" size="icon">
                                <span className="icon-[ph--arrow-up-fill] w-4 h-4 text-success" />
                            </Button>
                            <div className="ml-3">
                                <p className="text-sm font-semibold">{formatCurrency(income, account.currency.code)}</p>
                                <p className="text-xs text-secondary-foreground">Income</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Button variant="negative" className="cursor-auto" size="icon">
                                <span className="icon-[ph--arrow-down-fill] w-4 h-4 text-destructive" />
                            </Button>
                            <div className="ml-3">
                                <p className="text-sm font-semibold">{formatCurrency(expenses, account.currency.code)}</p>
                                <p className="text-xs text-secondary-foreground">Expenses</p>
                            </div>
                        </div>
                    </div>

                    {parsedUser.role == Role.Client && <div className="flex items-center justify-center lg:justify-start gap-4">
                            <Button variant="primary" size="lg" onClick={onSendClick}>Send</Button>
                           <Button variant="negative" size="lg" onClick={onDetailsClick}>
                                {cardPageVersion ? "Account info": "Details"}
                            </Button>
                        </div> }

                </div>
            </div>

            <div className="flex justify-center lg:justify-end pt-8 lg:pt-0">
                <Wallet className="size-full"/>
            </div>
        </Card>
    );
};

export default BankAccountBalanceCard;