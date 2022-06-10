-- ============================================================================
-- TRANSACTION TABLE DEFINITION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CREATE Transaction Log TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS t_transaction_log (
  process_date      date    NOT NULL,
  process_time      time    NOT NULL,
  staff_id          integer NOT NULL,
  kind              integer NOT NULL, -- EX) 1: regist, 2: update, 3: delete ...
  process           text    NOT NULL
);

-- ----------------------------------------------------------------------------
-- CREATE Sales, Sales Details TABLE
-- ----------------------------------------------------------------------------
-- Sales Slip
CREATE TABLE IF NOT EXISTS t_sales (
  sales_id          bigserial,
  sales_date        date    NOT NULL,
  staff_id          integer NOT NULL,
  customer_id       integer NOT NULL, -- In Company Id
  customer_staff_id integer,

  cost              numeric NOT NULL, -- Cost Summary
  te_price          numeric NOT NULL, -- Tax Exclude Summary
  tax               numeric NOT NULL, -- Tax Summary
  ti_price          numeric NOT NULL, -- Tax Include Summary
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (sales_id)
);
-- Sales Slip Detail
CREATE TABLE IF NOT EXISTS t_sales_details (
  sales_id          bigint  NOT NULL,
  detail_id         integer NOT NULL,

  quantity          numeric NOT NULL,
  unit_cost         numeric NOT NULL,
  cost              numeric NOT NULL,
  unit_price        numeric NOT NULL,
  te_price          numeric NOT NULL, -- Tax Exclude
  tax               numeric NOT NULL, -- For Reduced Tax Rate
  ti_price          numeric NOT NULL, -- Tax Include
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (sales_id, detail_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Estimate, Estimate Details TABLE
-- ----------------------------------------------------------------------------
-- Estimate Slip
CREATE TABLE IF NOT EXISTS t_estimate (
  estimate_id       bigserial,
  estimate_date     date    NOT NULL,
  staff_id          integer NOT NULL,
  customer_id       integer NOT NULL, -- Company Id
  customer_staff_id integer,

  cost              numeric NOT NULL, -- Cost Summary
  te_price          numeric NOT NULL, -- Tax Exclude Summary
  tax               numeric NOT NULL, -- Tax Summary
  ti_price          numeric NOT NULL, -- Tax Include Summary
  discription       text,

  is_fix            boolean DEFAULT false,
  sales_id          bigint,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (estimate_id)
);

-- Estimate Slip Detail
CREATE TABLE IF NOT EXISTS t_estimate_details (
  estimate_id       bigint  NOT NULL,
  detail_id         integer NOT NULL,

  quantity          numeric NOT NULL,
  unit_cost         numeric NOT NULL,
  cost              numeric NOT NULL,
  unit_price        numeric NOT NULL,
  te_price          numeric NOT NULL, -- Tax Exclude
  tax               numeric NOT NULL, -- For Reduced Tax Rate
  ti_price          numeric NOT NULL, -- Tax Include
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (estimate_id, detail_id)
);

-- ----------------------------------------------------------------------------
-- CREATE Purchase, Purchase Details TABLE
-- ----------------------------------------------------------------------------
-- Purchase Slip
CREATE TABLE IF NOT EXISTS t_purchase (
  purchase_id       bigserial,
  purchase_date     date    NOT NULL,
  staff_id          integer NOT NULL,
  maker_id          integer NOT NULL, -- Company Id
  maker_staff_id    integer,

  te_price          numeric NOT NULL, -- Tax Exclude Summary
  tax               numeric NOT NULL, -- Tax Summary
  ti_price          numeric NOT NULL, -- Tax Include Summary
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (purchase_id)
);

-- Purchase Slip Detail
CREATE TABLE IF NOT EXISTS t_purchase_details (
  purchase_id       bigint  NOT NULL,
  detail_id         integer NOT NULL,

  goods_id          serial,
  material_id       serial,
  quantity          numeric NOT NULL,
  unit_price        numeric NOT NULL,
  te_price          numeric NOT NULL, -- Tax Exclude
  tax               numeric NOT NULL, -- For Reduced Tax Rate
  ti_price          numeric NOT NULL, -- Tax Include
  discription       text,

  regist_staff      integer,
  regist_time       timestamp,
  update_staff      integer,
  update_time       timestamp,

  PRIMARY KEY (purchase_id, detail_id)
);
