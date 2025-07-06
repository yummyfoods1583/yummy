CREATE OR REPLACE FUNCTION multi_cart_handle()
RETURNS TRIGGER AS $$
--trigger to delete other existing cart of a customer before inserting new one  
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT * FROM CART WHERE CUSTOMER_ID = NEW.CUSTOMER_ID
  LOOP
    IF r.REST_ID != NEW.REST_ID THEN
      DELETE FROM CART WHERE CART_ID = r.CART_ID AND CART_STATUS='ACTIVE';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER multi_cart_handle_trigger
BEFORE INSERT ON CART
FOR EACH ROW
EXECUTE FUNCTION multi_cart_handle();


CREATE OR REPLACE FUNCTION multi_cart_item_handle_func()
RETURNS TRIGGER AS $$
--trigger to delete other existing cart of a customer before inserting new one  
BEGIN
  DELETE FROM cart_item 
  WHERE cart_id = NEW.cart_id 
  AND sub_cat_id = NEW.sub_cat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER multi_cart_item_handle
BEFORE INSERT ON cart_item
FOR EACH ROW
EXECUTE FUNCTION multi_cart_item_handle_func();

CREATE OR REPLACE FUNCTION handle_order_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cart SET cart_status = 'COMPLETED' WHERE cart_id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER handle_order
BEFORE INSERT ON order_
FOR EACH ROW
EXECUTE FUNCTION handle_order_trigger();

