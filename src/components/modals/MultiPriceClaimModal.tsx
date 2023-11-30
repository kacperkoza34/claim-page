import { ClaimingButton } from "@src/components/ClaimingPage/ClaimingButton";
import { Button } from "@src/components/shared/Button";
import { Checkbox } from "@src/components/shared/Checkbox";
import { Modal } from "@src/components/shared/Modal";
import { useModal } from "@src/utils/hooks/useModal";
import uniqueId from "lodash/uniqueId";
import map from "lodash/map";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { RequiredAllowance } from "@src/utils/hooks/useClaiming";

export const MultiPriceClaimModal: React.FC<{
  prices: RequiredAllowance[];
}> = ({ prices }) => {
  const [selectedPrice, setSelectedPrice] = useState<null | RequiredAllowance>(
    null
  );
  const { modalOpen, toggleModal } = useModal("MultiPriceClaimModal");
  const [error, setError] = useState<null | string>(null);

  const handleNoPriceSelected = useCallback(() => {
    setError("Please choose your currency");
  }, []);

  useEffect(() => {
    if (error && selectedPrice) {
      setError(null);
    }
  }, [error, selectedPrice]);

  return (
    <Modal hideCross open={modalOpen} handleOnOpenChange={toggleModal}>
      <div className="max-w-[446px] mx-auto mb-10 flex flex-col justify-center items-center gap-3.5 text-center">
        <h2>Choose preferred currency</h2>
      </div>
      <div className="flex flex-col  mx-auto justify-center w-full px-28">
        <div className="grid  max-w-[446px] mx-auto justify-center">
          {map(prices, (price) => (
            <Checkbox
              key={uniqueId(`${price.symbol}-${price.price}-${price.token_id}`)}
              name={price.symbol}
              checked={selectedPrice === price}
              label={`${price.price} ${price.symbol}`}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPrice(price);
                } else {
                  setSelectedPrice(null);
                }
              }}
            />
          ))}
        </div>
        <p className="mx-auto text-error min-h-[18.9px]">{error}</p>

        <div className="flex w-full justify-between pt-9">
          <Button transparent onClick={toggleModal}>
            Close
          </Button>
          {selectedPrice ? (
            <ClaimingButton {...selectedPrice} />
          ) : (
            <Button onClick={handleNoPriceSelected} type="button">
              Claim
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
